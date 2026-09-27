import {
  AuditLogRepository,
  type CreateAuditLogInput,
} from '../repositories/auditLogRepository.ts';

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(
    auditLogRepository: AuditLogRepository = new AuditLogRepository(),
  ) {
    this.auditLogRepository = auditLogRepository;
  }

  async getAllAuditLogs() {
    return this.auditLogRepository.findAll();
  }

  async createAuditLog(input: CreateAuditLogInput) {
    return this.auditLogRepository.create(input);
  }
}