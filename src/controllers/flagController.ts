import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(
    flagService: FlagService = new FlagService(),
  ) {
    this.flagService = flagService;
  }

  getFlags = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const flags = await this.flagService.getAllFlags();

      return res.status(200).json({
        status: 'success',
        data: flags,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  updateFlag = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const flag = await this.flagService.updateFlagStatus(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).json({
        status: 'success',
        data: flag,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'FLAG_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Flag tidak ditemukan',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}