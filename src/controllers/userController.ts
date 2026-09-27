import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  private userService: UserService;

  constructor(
    userService: UserService = new UserService(),
  ) {
    this.userService = userService;
  }

  getUsers = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  createUser = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const user = await this.userService.createUser(req.body);

      return res.status(201).json({
        status: 'success',
        data: user,
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