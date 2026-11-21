import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { auditLogListSchema, auditLogDetailSchema } from '../schemas/auditLogSchema.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.use(authenticate, authorize('admin'));

auditLogRouter.get(
  '/',
  validate(auditLogListSchema),
  (req, res, next) => {
    // #swagger.tags = ['Audit Logs']
    // #swagger.summary = 'Daftar audit log dengan filter dan pagination'
    // #swagger.parameters['page'] = { in: 'query', type: 'integer', default: 1, minimum: 1 }
    // #swagger.parameters['pageSize'] = { in: 'query', type: 'integer', default: 20, minimum: 1, maximum: 100 }
    // #swagger.parameters['action'] = { in: 'query', type: 'string', maxLength: 50 }
    // #swagger.parameters['targetTable'] = { in: 'query', type: 'string', maxLength: 50 }
    // #swagger.parameters['targetId'] = { in: 'query', type: 'integer', minimum: 1 }
    // #swagger.parameters['userId'] = { in: 'query', type: 'integer', minimum: 1 }
    // #swagger.parameters['from'] = { in: 'query', type: 'string', format: 'date' }
    // #swagger.parameters['to'] = { in: 'query', type: 'string', format: 'date' }
    // #swagger.responses[200] = { description: 'Daftar audit log dan pagination', schema: { $ref: '#/definitions/AuditLogListResponse' } }
    // #swagger.responses[400] = { description: 'Parameter query tidak valid', schema: { $ref: '#/definitions/ValidationErrorResponse' } }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin yang dapat mengakses' }
    return auditLogController.getAuditLogs(req, res, next);
  },
);

auditLogRouter.get(
  '/:id',
  validate(auditLogDetailSchema),
  (req, res, next) => {
    // #swagger.tags = ['Audit Logs']
    // #swagger.summary = 'Detail audit log'
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', minimum: 1 }
    // #swagger.responses[200] = { description: 'Detail audit log beserta pengguna dan metadata', schema: { $ref: '#/definitions/AuditLogDetailResponse' } }
    // #swagger.responses[400] = { description: 'ID tidak valid', schema: { $ref: '#/definitions/ValidationErrorResponse' } }
    // #swagger.responses[401] = { description: 'Token tidak ada atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin yang dapat mengakses' }
    // #swagger.responses[404] = { description: 'Audit log tidak ditemukan' }
    return auditLogController.getAuditLogById(req, res, next);
  },
);

export { auditLogRouter };
