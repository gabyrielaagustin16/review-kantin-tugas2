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
};

const outputFile = './src/docs/swagger-output.json'; // Sesuaikan dengan nama file output kamu
const routes = ['./src/index.ts']; // Atau './src/app.ts' / lokasi router kamu

swaggerAutogen()(outputFile, routes, doc);