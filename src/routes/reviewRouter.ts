import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts'; // 1. Import middleware

const reviewRouter = Router();
const reviewController = new ReviewController();

// GET ulasan tetap terbuka untuk publik (tanpa token)
reviewRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar review dengan informasi user' }
  return reviewController.getReviews(req, res);
});

// POST ulasan diproteksi (wajib pakai token)
reviewRouter.post('/', authenticateToken, (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { stallId: { type: 'integer', example: 3 }, rating: { type: 'integer', example: 5 }, comment: { type: 'string', example: 'Makanannya enak.' } } } }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  return reviewController.createReview(req, res);
});

// DELETE ulasan diproteksi (wajib pakai token)
reviewRouter.delete('/:id', authenticateToken, (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Review dihapus' }
  // #swagger.responses[404] = { description: 'Review tidak ditemukan' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };