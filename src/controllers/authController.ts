import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}