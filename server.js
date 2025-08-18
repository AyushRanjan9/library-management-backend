// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const libraryRoutes = require('./routes/library.routes');
const dotenv = require('dotenv');
const db = require('./config/db.config');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// // Middleware - Allow all origins for development
// app.use(cors({
//     origin: true, // Allow all origins
//     credentials: true,
//     optionsSuccessStatus: 200,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
// }));

app.use(cors({
  origin: "*",   // allow all origins (or specify your Swagger UI domain)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Library Management API Documentation',
  swaggerOptions: {
    requestInterceptor: (request) => {
      request.headers['Access-Control-Allow-Origin'] = '*';
      return request;
    }
  }
}));

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.sendStatus(200);
});

// API routes
app.use('/api', libraryRoutes);

// Initialize database and start the server
db.initialize((err) => {
    if (err) {
        console.error('❌ Failed to initialize database:', err.message);
        process.exit(1);
    }
    
    // Start the server only after database is initialized
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        console.log(`💾 Using in-memory SQLite database`);
    });
});