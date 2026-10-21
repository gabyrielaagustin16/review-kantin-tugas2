import { AppError } from './AppError';

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public errors: FieldError[];

  constructor(errors: FieldError[], message = 'Validasi gagal') {
    super(400, message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}