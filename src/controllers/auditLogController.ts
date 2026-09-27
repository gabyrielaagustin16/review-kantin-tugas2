import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(
    auditLogService: AuditLogService = new AuditLogService(),
  ) {
    this.auditLogService = auditLogService;
  }

  getAuditLogs = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const auditLogs = await this.auditLogService.getAllAuditLogs();

      return res.status(200).json({
        status: 'success',
        data: auditLogs,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  createAuditLog = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const auditLog = await this.auditLogService.createAuditLog(
        req.body,
      );

      return res.status(201).json({
        status: 'success',
        data: auditLog,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}