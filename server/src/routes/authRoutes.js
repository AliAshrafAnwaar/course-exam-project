const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validate, registerRules, loginRules } = require('../middleware/validation');

// POST /api/v1/auth/register
router.post('/register', registerRules, validate, authController.register);

// POST /api/v1/auth/login
router.post('/login', loginRules, validate, authController.login);

// GET /api/v1/auth/me
router.get('/me', auth, authController.getProfile);

// PUT /api/v1/auth/profile
router.put('/profile', auth, authController.updateProfile);

// PUT /api/v1/auth/password
router.put('/password', auth, authController.changePassword);

module.exports = router;
