import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, logoutUser } from '../services/authService.ts';
import { getClientInfo } from '../utils/clientInfo.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

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
    const result = await loginUser(req.body, getClientInfo(req));
    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as Request & {
      user?: { id: number | string; role: string };
    }).user;
    if (!user) throw new UnauthorizedError();

    const userId = Number(user.id);
    if (!Number.isSafeInteger(userId) || userId < 1) throw new UnauthorizedError();

    await logoutUser({ id: userId, role: user.role }, getClientInfo(req));
    return res.status(200).json({ status: 'success', message: 'Logout berhasil' });
  } catch (error) {
    next(error);
    return res;
  }
}