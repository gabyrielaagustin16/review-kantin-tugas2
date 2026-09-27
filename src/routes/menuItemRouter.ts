import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar menu' }
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { stallId: { type: 'integer', example: 3 }, name: { type: 'string', example: 'Cakalang Fufu' }, price: { type: 'integer', example: 25000 }, isAvailable: { type: 'boolean', example: true } } } }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail menu' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[200] = { description: 'Menu di-update' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu dihapus' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };