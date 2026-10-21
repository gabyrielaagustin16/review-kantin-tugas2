import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

export const authRouter = Router();

authRouter.post('/register', (req, res, next) => {
  // Ditulis seperti ini agar swagger-autogen otomatis buatkan form body
  const { name, email, password } = req.body;
  return register(req, res, next);
});

authRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  return login(req, res, next);
});

// Endpoint GET /auth/me (Wajib Login)
authRouter.get('/me', authenticate, (req, res) => {
  // #swagger.responses[200] = { description: 'Informasi profil user yang sedang login' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  return res.status(200).json({
    status: 'success',
    data: (req as any).user,
  });
});