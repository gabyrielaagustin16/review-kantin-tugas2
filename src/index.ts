import express from 'express';
import { getDb } from './db/index.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { userRouter } from './routes/userRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json';

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

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

app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit-logs', auditLogRouter);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});