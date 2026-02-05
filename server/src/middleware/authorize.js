const { AppError } = require('./errorHandler');

// Helper to check if user is admin
const isAdmin = (user) => {
  return user?.role?.name === 'Super Admin' || user?.role?.name === 'admin';
};

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    // Admin bypass - admins have all permissions
    if (isAdmin(req.user)) {
      req.isAdmin = true;
      return next();
    }

    const userPermissions = req.user.role?.permissions?.map(p => p.name) || [];

    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }

    req.isAdmin = false;
    next();
  };
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    const userRole = req.user.role?.name;

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }

    next();
  };
};

const isOwnerOrAdmin = (resourceUserIdField = 'created_by') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    // Admin bypass
    if (req.user.role?.name === 'admin' || req.user.role?.name === 'Super Admin') {
      return next();
    }

    // Check if resource is loaded and user is owner
    if (req.resource && req.resource[resourceUserIdField] === req.user.id) {
      return next();
    }

    return next(new AppError('Access denied', 403, 'FORBIDDEN'));
  };
};

module.exports = { authorize, authorizeRoles, isOwnerOrAdmin, isAdmin };
