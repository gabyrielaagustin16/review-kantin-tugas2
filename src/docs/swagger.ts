import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
definitions: {
  StallInput: {
    $ownerId: 2,
    $name: 'Warung Baru',
    category: 'Makanan',
    location: 'Gedung A',
    description: '',
  },

  MenuItemInput: {
    $stallId: 3,
    $name: 'Cakalang Fufu',
    $price: 25000,
    $isAvailable: true,
  },
},
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);