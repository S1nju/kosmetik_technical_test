var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import Database and DB sync if necessary
const sequelize = require('./config/database');

// Import routes
var rawMaterialRoutes = require('./routes/rawMaterial.routes');
const errorHandler = require('./middlewares/errorHandler');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use('/api/raw-materials', rawMaterialRoutes);

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
