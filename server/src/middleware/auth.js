const jwt = require('jsonwebtoken');
const config = require('../config/app.config');
const { User, Role, Permission } = require('../models');
const { AppError } = require('./errorHandler');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        as: 'role',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user) {
      throw new AppError('User not found', 401, 'UNAUTHORIZED');
    }

    if (!user.is_active) {
      throw new AppError('User account is disabled', 401, 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(error);
    }
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: Role,
        as: 'role',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (user && user.is_active) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, optionalAuth };
