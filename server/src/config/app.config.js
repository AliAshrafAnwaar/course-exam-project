require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  bcrypt: {
    saltRounds: 10
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  },
  
  geneticAlgorithm: {
    populationSize: 100,
    generations: 50,
    mutationRate: 0.1,
    elitismCount: 2
  }
};
