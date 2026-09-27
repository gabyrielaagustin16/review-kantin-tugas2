import { Router } from 'express';

import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();

const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar flag' }
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { status: { type: 'string', example: 'resolved' } } } }
  // #swagger.responses[200] = { description: 'Status flag di-update' }
  // #swagger.responses[404] = { description: 'Flag tidak ditemukan' }
  return flagController.updateFlag(req, res);
});

export { flagRouter };