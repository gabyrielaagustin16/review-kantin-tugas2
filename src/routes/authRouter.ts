import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { registerSchema, loginSchema } from '../schemas/authSchema.ts';
import { authenticate } from '../middlewares/auth.ts';

export const authRouter = Router();

// Tambahkan validate(registerSchema)
authRouter.post('/register', validate(registerSchema), (req, res, next) => {
  const { name, email, password } = req.body;
  return register(req, res, next);
});

// Tambahkan validate(loginSchema)
authRouter.post('/login', validate(loginSchema), (req, res, next) => {
  const { email, password } = req.body;
  return login(req, res, next);
});

authRouter.get('/me', authenticate, (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: (req as any).user,
  });
});

authRouter.post(
  '/logout',
  authenticate,
  (req, res, next) => {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Logout dan catat audit'
    // #swagger.responses[200] = { description: 'Logout berhasil' }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    return logout(req, res, next);
  },
);