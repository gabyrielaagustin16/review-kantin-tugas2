import { Router } from 'express';

import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();

const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  return auditLogController.getAuditLogs(req, res);
});

auditLogRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { type: 'object', properties: { userId: { type: 'integer', example: 1 }, action: { type: 'string', example: 'CREATE' }, targetTable: { type: 'string', example: 'REVIEWS' }, targetId: { type: 'integer', example: 2 }, metadata: { type: 'string', example: 'rating:4' } } } }
  // #swagger.responses[201] = { description: 'Audit log dibuat' }
  return auditLogController.createAuditLog(req, res);
});

export { auditLogRouter };