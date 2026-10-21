import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: number | string;
  email: string;
  role: 'admin' | 'owner' | 'customer' | string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'secret_key_default';
    const decoded = jwt.verify(token, secretKey) as UserPayload;

    req.user = decoded;
    next();
  } catch (error) {
    // Sesuai aturan Tugas 3: Token salah/expired masuk kategori 401 (belum terautentikasi)
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid atau sudah kadaluwarsa.',
    });
  }
};

// Middleware Otorisasi Role (Khusus menghasilkan 403 Forbidden)
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Akses ditolak. Anda belum terautentikasi.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Akses dilarang. Peran (role) Anda tidak memiliki izin untuk tindakan ini.',
      });
    }

    next();
  };
};