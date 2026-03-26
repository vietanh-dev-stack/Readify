import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Store API',
      version: '1.0.0',
      description: 'API documentation for Book Store system'
    },
    servers: [
      {
        url: 'http://localhost:3000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/v1/*.js'] 
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec