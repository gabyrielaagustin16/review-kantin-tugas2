import express from 'express';
import cors from 'cors';
import { getDb } from './db/index.ts';
import { authRouter } from './routes/authRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { userRouter } from './routes/userRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json';

const app = express();
const port = 3000;

// Middleware Global
app.use(cors()); // Izinkan CORS untuk Frontend React
app.use(express.json());

// Documentation Swagger UI
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Health Check Endpoint
app.get('/health', async (_req, res) => {
  try {
    await getDb();
    return res.status(200).json({
      status: 'success',
      message: 'API dan database terhubung',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database tidak terhubung',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Route Autentikasi & Utama
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit-logs', auditLogRouter);

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});