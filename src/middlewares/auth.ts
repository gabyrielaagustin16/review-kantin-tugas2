import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/tokenService.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';

export interface AuthUser {
  id: number;
  email: string;
  role: 'admin' | 'owner' | 'customer' | string;
  [key: string]: any;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Akses ditolak. Token tidak ditemukan atau format salah');
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = verifyToken(token) as AuthUser;
    (req as any).user = user;
    next();
  } catch (_err) {
    throw new UnauthorizedError('Akses ditolak. Token tidak valid atau telah kadaluwarsa');
  }
}

export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new UnauthorizedError('Akses ditolak. Anda belum terautentikasi.');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Akses dilarang. Anda tidak memiliki izin untuk melakukan tindakan ini.');
    }

    next();
  };
}