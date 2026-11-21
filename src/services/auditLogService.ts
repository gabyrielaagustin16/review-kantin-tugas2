import {
  AuditLogRepository,
  type CreateAuditLogInput,
  type AuditLogFilters,
} from '../repositories/auditLogRepository.ts';
import type mssql from 'mssql';
import type { ClientInfo } from '../utils/clientInfo.ts';

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(
    auditLogRepository: AuditLogRepository = new AuditLogRepository(),
  ) {
    this.auditLogRepository = auditLogRepository;
  }

  async getAuditLogs(filters: AuditLogFilters) {
    return this.auditLogRepository.findPage(filters);
  }

  async getAuditLogById(id: number) {
    return this.auditLogRepository.findById(id);
  }

  async record(input: CreateAuditLogInput, transaction?: mssql.Transaction) {
    return this.auditLogRepository.insert(input, transaction);
  }

  async recordBestEffort(input: CreateAuditLogInput) {
    try {
      await this.record(input);
    } catch (error) {
      console.error('Gagal menulis audit autentikasi:', error);
    }
  }
}

export function buildAuthMetadata(
  role: string | null,
  client: ClientInfo,
  result: 'success' | 'failed',
): Record<string, unknown> {
  return {
    role,
    ip_address: client.ipAddress,
    user_agent: client.userAgent,
    result,
  };
}