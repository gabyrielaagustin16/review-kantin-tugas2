import { Router } from 'express';

import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();

const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { reviewId: { type: 'integer', example: 2 }, userId: { type: 'integer', example: 4 } } } }
  // #swagger.responses[201] = { description: 'Like dibuat' }
  return likeController.createLike(req, res);
});

likeRouter.delete('/:reviewId/:userId', (req, res) => {
  // #swagger.parameters['reviewId'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['userId'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Like dihapus' }
  // #swagger.responses[404] = { description: 'Like tidak ditemukan' }
  return likeController.deleteLike(req, res);
});

export { likeRouter };