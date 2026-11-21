import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    description: 'Dokumentasi API Review Kantin',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  // Tambahkan konfigurasi ini agar tombol Authorize muncul di Swagger UI
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Masukkan token dengan format: Bearer <TOKEN_JWT_KAMU>',
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  definitions: {
    AuditLogItem: {
      id: { type: 'integer', example: 21 },
      userId: { type: 'integer', example: 1, 'x-nullable': true },
      userName: { type: 'string', example: 'Admin Kantin', 'x-nullable': true },
      userEmail: { type: 'string', example: 'admin@kantin.test', 'x-nullable': true },
      action: { type: 'string', example: 'LOGOUT' },
      targetTable: { type: 'string', example: 'USERS' },
      targetId: { type: 'integer', example: 1 },
      metadata: {
        type: 'object',
        example: {
          role: 'admin',
          ip_address: '::1',
          user_agent: 'Mozilla/5.0',
          result: 'success',
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
    },
    AuditLogPagination: {
      page: { type: 'integer', example: 1 },
      pageSize: { type: 'integer', example: 20 },
      total: { type: 'integer', example: 1 },
      totalPages: { type: 'integer', example: 1 },
    },
    AuditLogListResponse: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/definitions/AuditLogItem' },
            },
            pagination: { $ref: '#/definitions/AuditLogPagination' },
          },
        },
      },
    },
    AuditLogDetailResponse: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        data: { $ref: '#/definitions/AuditLogItem' },
      },
    },
    ValidationErrorResponse: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'fail' },
        message: { type: 'string', example: 'Validasi gagal' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'page' },
              message: { type: 'string', example: 'Page harus berupa bilangan bulat minimal 1' },
            },
          },
        },
      },
    },
  },
};

const outputFile = './src/docs/swagger-output.json'; // Sesuaikan dengan nama file output kamu
const routes = ['./src/index.ts']; // Atau './src/app.ts' / lokasi router kamu

swaggerAutogen()(outputFile, routes, doc);