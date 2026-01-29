require('dotenv').config();
const winston = require('winston');
const app = require('./src/app');
const config = require('./src/config/app.config');
const { testConnection } = require('./src/config/database');
const { sequelize } = require('./src/models');

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Make logger available globally
global.logger = logger;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    logger.info('Database connection established');

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();