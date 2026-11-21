import mssql from 'mssql';
import { getPool } from '../db/index.ts';

export interface CreateAuditLogInput {
  userId: number | null;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: Record<string, unknown> | null;
}

export interface AuditLogFilters {
  page: number;
  pageSize: number;
  action?: string;
  targetTable?: string;
  targetId?: number;
  userId?: number;
  from?: string;
  to?: string;
}

function parseMetadata(metadata: unknown) {
  if (typeof metadata !== 'string') return metadata ?? null;
  try {
    return JSON.parse(metadata);
  } catch {
    return null;
  }
}

function bindFilters(request: mssql.Request, filters: Omit<AuditLogFilters, 'page' | 'pageSize'>) {
  if (filters.action) request.input('action', mssql.NVarChar(50), filters.action);
  if (filters.targetTable) request.input('targetTable', mssql.NVarChar(50), filters.targetTable);
  if (filters.targetId !== undefined) request.input('targetId', mssql.Int, filters.targetId);
  if (filters.userId !== undefined) request.input('userId', mssql.Int, filters.userId);
  if (filters.from) request.input('fromDate', mssql.DateTime2, new Date(`${filters.from}T00:00:00.000Z`));
  if (filters.to) request.input('toDate', mssql.DateTime2, new Date(`${filters.to}T00:00:00.000Z`));
  return request;
}

function filterWhere(filters: Omit<AuditLogFilters, 'page' | 'pageSize'>) {
  const clauses: string[] = [];
  if (filters.action) clauses.push('a.action = @action');
  if (filters.targetTable) clauses.push('a.target_table = @targetTable');
  if (filters.targetId !== undefined) clauses.push('a.target_id = @targetId');
  if (filters.userId !== undefined) clauses.push('a.user_id = @userId');
  if (filters.from) clauses.push('a.created_at >= CAST(@fromDate AS date)');
  if (filters.to) clauses.push('a.created_at < DATEADD(day, 1, CAST(@toDate AS date))');
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

export class AuditLogRepository {
  async findPage(filters: AuditLogFilters) {
    const pool = await getPool();
    const { page, pageSize, ...filterInput } = filters;
    const where = filterWhere(filterInput);

    const countRequest = bindFilters(pool.request(), filterInput);
    const countResult = await countRequest.query(
      `SELECT COUNT(*) AS total FROM dbo.AUDIT_LOGS a ${where}`,
    );
    const total = Number(countResult.recordset[0]?.total ?? 0);

    const dataRequest = bindFilters(pool.request(), filterInput);
    const offset = (BigInt(page) - 1n) * BigInt(pageSize);
    dataRequest.input('offset', mssql.BigInt, offset.toString());
    dataRequest.input('pageSize', mssql.Int, pageSize);
    const dataResult = await dataRequest.query(`
      SELECT a.id, a.user_id AS userId, u.name AS userName, u.email AS userEmail,
             a.action, a.target_table AS targetTable, a.target_id AS targetId,
             a.metadata, a.created_at AS createdAt
      FROM dbo.AUDIT_LOGS a
      LEFT JOIN dbo.USERS u ON u.id = a.user_id
      ${where}
      ORDER BY a.created_at DESC, a.id DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

    return {
      items: dataResult.recordset.map((row: any) => ({
        id: row.id,
        userId: row.userId,
        userName: row.userName,
        userEmail: row.userEmail,
        action: row.action,
        targetTable: row.targetTable,
        targetId: row.targetId,
        metadata: parseMetadata(row.metadata),
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: number) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', mssql.Int, id)
      .query(`
        SELECT a.id, a.user_id AS userId, u.name AS userName, u.email AS userEmail,
               a.action, a.target_table AS targetTable, a.target_id AS targetId,
               a.metadata, a.created_at AS createdAt
        FROM dbo.AUDIT_LOGS a
        LEFT JOIN dbo.USERS u ON u.id = a.user_id
        WHERE a.id = @id
      `);
    const row = result.recordset[0];
    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      userEmail: row.userEmail,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: parseMetadata(row.metadata),
      createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    };
  }

  async insert(input: CreateAuditLogInput, transaction?: mssql.Transaction) {
    const request = transaction
      ? new mssql.Request(transaction)
      : (await getPool()).request();
    await request
      .input('userId', mssql.Int, input.userId)
      .input('action', mssql.NVarChar(50), input.action)
      .input('targetTable', mssql.NVarChar(50), input.targetTable)
      .input('targetId', mssql.Int, input.targetId)
      .input(
        'metadata',
        mssql.NVarChar(mssql.MAX),
        input.metadata == null ? null : JSON.stringify(input.metadata),
      )
      .query(`
        INSERT INTO dbo.AUDIT_LOGS
          (user_id, action, target_table, target_id, metadata, created_at)
        VALUES (@userId, @action, @targetTable, @targetId, @metadata, SYSUTCDATETIME())
      `);
  }
}
