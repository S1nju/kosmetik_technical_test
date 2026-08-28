var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import Database and DB sync if necessary
const sequelize = require('./config/database');

// Import routes
var rawMaterialRoutes = require('./routes/rawMaterial.routes');
var authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/auth.middleware');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KosmetikOn Technical Test API',
      version: '1.0.0',
      description: 'API documentation generated automatically from JSDoc comments within the code.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js', './swagger-schemas.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate Limiter Setup
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: {
            message: 'Too many requests from this IP, please try again after 15 minutes'
        }
    }
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/raw-materials', authMiddleware, rawMaterialRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Initialization: check DB connection (no sync since we use raw SQL in /database per requirements, 
// but we just test connection here)
sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = app;
