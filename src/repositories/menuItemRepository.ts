import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';
import mssql from 'mssql';
import { getPool } from '../db/index.ts';
import { AuditLogService } from '../services/auditLogService.ts';
import { AUDIT_ACTIONS } from '../constants/auditActions.ts';
import type { ClientInfo } from '../utils/clientInfo.ts';

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export class MenuItemRepository {
  private auditLogService = new AuditLogService();

  async findAll() {
    const db = await getDb();
    return db.select().from(menuItems);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));

    return rows[0];
  }

async findByStallId(stallId: number) {
  const db = await getDb();

  return db
    .select({
      id: menuItems.id,
      stallId: menuItems.stallId,
      name: menuItems.name,
      price: menuItems.price,
      isAvailable: menuItems.isAvailable,
      stallName: stalls.name,
    })
    .from(menuItems)
    .leftJoin(stalls, eq(menuItems.stallId, stalls.id))
    .where(eq(menuItems.stallId, stallId));
}

  async create(
    input: CreateMenuItemInput,
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ) {
    const pool = await getPool();
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();
    try {
      const result = await new mssql.Request(transaction)
        .input('stallId', mssql.Int, input.stallId)
        .input('name', mssql.NVarChar(100), input.name)
        .input('price', mssql.Int, input.price)
        .input('isAvailable', mssql.Bit, input.isAvailable)
        .query(`
          INSERT INTO dbo.MENU_ITEMS (stall_id, name, price, is_available)
          OUTPUT INSERTED.id, INSERTED.stall_id AS stallId, INSERTED.name,
                 INSERTED.price, INSERTED.is_available AS isAvailable
          VALUES (@stallId, @name, @price, @isAvailable)
        `);
      const row = result.recordset[0];
      await this.writeMutationAudit(transaction, user, AUDIT_ACTIONS.CREATE_MENU, row.id, client);
      await transaction.commit();
      return row;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(
    id: number,
    input: Partial<CreateMenuItemInput>,
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ) {
    const pool = await getPool();
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();
    try {
      const current = await new mssql.Request(transaction)
        .input('id', mssql.Int, id)
        .query('SELECT * FROM dbo.MENU_ITEMS WHERE id = @id');
      const existing = current.recordset[0];
      if (!existing) throw new Error('MENU_ITEM_NOT_FOUND');
      const result = await new mssql.Request(transaction)
        .input('id', mssql.Int, id)
        .input('stallId', mssql.Int, input.stallId ?? existing.stall_id)
        .input('name', mssql.NVarChar(100), input.name ?? existing.name)
        .input('price', mssql.Int, input.price ?? existing.price)
        .input('isAvailable', mssql.Bit, input.isAvailable ?? existing.is_available)
        .query(`
          UPDATE dbo.MENU_ITEMS
          SET stall_id = @stallId, name = @name, price = @price, is_available = @isAvailable
          OUTPUT INSERTED.id, INSERTED.stall_id AS stallId, INSERTED.name,
                 INSERTED.price, INSERTED.is_available AS isAvailable
          WHERE id = @id
        `);
      const row = result.recordset[0];
      await this.writeMutationAudit(transaction, user, AUDIT_ACTIONS.UPDATE_MENU, id, client);
      await transaction.commit();
      return row;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(
    id: number,
    user?: { id: number; role: string },
    client: ClientInfo = { ipAddress: null, userAgent: null },
  ) {
    const pool = await getPool();
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();
    try {
      const result = await new mssql.Request(transaction)
        .input('id', mssql.Int, id)
        .query(`
          DELETE FROM dbo.MENU_ITEMS
          OUTPUT DELETED.id, DELETED.stall_id AS stallId, DELETED.name,
                 DELETED.price, DELETED.is_available AS isAvailable
          WHERE id = @id
        `);
      const row = result.recordset[0];
      if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
      await this.writeMutationAudit(transaction, user, AUDIT_ACTIONS.DELETE_MENU, id, client);
      await transaction.commit();
      return row;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async writeMutationAudit(
    transaction: mssql.Transaction,
    user: { id: number; role: string } | undefined,
    action: typeof AUDIT_ACTIONS.CREATE_MENU
      | typeof AUDIT_ACTIONS.UPDATE_MENU
      | typeof AUDIT_ACTIONS.DELETE_MENU,
    targetId: number,
    client: ClientInfo,
  ) {
    await this.auditLogService.record({
      userId: user?.id ?? null,
      action,
      targetTable: 'MENU_ITEMS',
      targetId,
      metadata: {
        role: user?.role ?? null,
        ip_address: client.ipAddress,
        user_agent: client.userAgent,
        result: 'success',
      },
    }, transaction);
  }
}