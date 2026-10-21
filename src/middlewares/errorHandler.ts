import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.ts';
import { ValidationError } from '../errors/ValidationError.ts';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  console.error('Unhandled Error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
}