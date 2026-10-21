import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  return stallController.getStalls(req, res);
});

// POST Warung (Wajib Login & Peran: owner / admin)
stallRouter.post('/', authenticate, authorize('owner', 'admin'), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  // #swagger.responses[403] = { description: 'Forbidden' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

// PUT Warung (Wajib Login & Peran: owner / admin)
stallRouter.put('/:id', authenticate, authorize('owner', 'admin'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  // #swagger.responses[403] = { description: 'Forbidden' }
  return stallController.updateStall(req, res);
});

// DELETE Warung (Wajib Login & Khusus Peran: admin)
stallRouter.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  // #swagger.responses[401] = { description: 'Unauthorized' }
  // #swagger.responses[403] = { description: 'Forbidden' }
  return stallController.deleteStall(req, res);
});

stallRouter.get('/:id/menus', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

export { stallRouter };