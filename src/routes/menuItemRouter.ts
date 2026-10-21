import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { authenticateToken } from '../middlewares/authMiddleware.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar menu' }
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.post('/', authenticateToken, (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { stallId: { type: 'integer' }, name: { type: 'string' }, price: { type: 'number' }, category: { type: 'string' } } } }
  // #swagger.responses[201] = { description: 'Menu berhasil dibuat' }
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.put('/:id', authenticateToken, (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu berhasil diperbarui' }
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', authenticateToken, (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu berhasil dihapus' }
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };