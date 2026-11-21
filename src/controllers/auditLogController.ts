import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';
import { AppError } from '../errors/AppError.ts';
import type { AuditLogFilters } from '../repositories/auditLogRepository.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(
    auditLogService: AuditLogService = new AuditLogService(),
  ) {
    this.auditLogService = auditLogService;
  }

  getAuditLogs = async (
    req: Request,
    res: Response,
    next: (error: unknown) => void,
  ): Promise<Response> => {
    try {
      const filters = req.query as unknown as AuditLogFilters;
      const auditLogs = await this.auditLogService.getAuditLogs(filters);
      return res.status(200).json({
        status: 'success',
        data: auditLogs,
      });
    } catch (error) {
      next(error);
      return res;
    }
  };

  getAuditLogById = async (
    req: Request,
    res: Response,
    next: (error: unknown) => void,
  ): Promise<Response> => {
    try {
      const auditLog = await this.auditLogService.getAuditLogById(Number(req.params.id));
      if (!auditLog) throw new AppError(404, 'Catatan audit tidak ditemukan');
      return res.status(200).json({
        status: 'success',
        data: auditLog,
      });
    } catch (error) {
      next(error);
      return res;
    }
  };
}