const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing library books, users, and fines',
      contact: {
        name: 'API Support',
        email: 'support@library.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server (Port 5000)'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Alternative server (Port 3000)'
      },
      {
        url: 'http://localhost:3001/api',
        description: 'Alternative server (Port 3001)'
      }
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            book_id: {
              type: 'integer',
              description: 'Unique identifier for the book'
            },
            title: {
              type: 'string',
              description: 'Title of the book'
            },
            isbn: {
              type: 'string',
              description: 'ISBN number of the book'
            },
            publication_year: {
              type: 'integer',
              description: 'Year the book was published'
            },
            copies_available: {
              type: 'integer',
              description: 'Number of copies available'
            },
            author_id: {
              type: 'integer',
              description: 'ID of the book author'
            },
            publisher_id: {
              type: 'integer',
              description: 'ID of the book publisher'
            },
            category_id: {
              type: 'integer',
              description: 'ID of the book category'
            }
          }
        },
        BookDetail: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the book'
            },
            isbn: {
              type: 'string',
              description: 'ISBN number of the book'
            },
            publication_year: {
              type: 'integer',
              description: 'Year the book was published'
            },
            copies_available: {
              type: 'integer',
              description: 'Number of copies available'
            },
            author_first_name: {
              type: 'string',
              description: 'First name of the author'
            },
            author_last_name: {
              type: 'string',
              description: 'Last name of the author'
            },
            publisher_name: {
              type: 'string',
              description: 'Name of the publisher'
            },
            category_name: {
              type: 'string',
              description: 'Name of the category'
            }
          }
        },
        Fine: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              description: 'First name of the user'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the user'
            },
            total_fines: {
              type: 'number',
              description: 'Total fine amount for the user'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'DB_QUERY_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'An error occurred while processing the request'
                },
                details: {
                  type: 'string',
                  example: 'Database connection failed'
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs; 