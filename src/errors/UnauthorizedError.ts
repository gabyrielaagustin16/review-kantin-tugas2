import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message = 'Akses ditolak. Token tidak ditemukan atau tidak valid') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}