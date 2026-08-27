const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Sequelize specific errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Uniqueness error: A record with these unique fields already exists.';
  }

  res.status(statusCode).json({
    error: {
      message
    }
  });
};

module.exports = errorHandler;
