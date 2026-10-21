import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message = 'Akses dilarang. Anda tidak memiliki hak akses') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}