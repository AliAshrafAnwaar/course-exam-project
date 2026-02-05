const jwt = require('jsonwebtoken');
const config = require('../config/app.config');
const { User, Role } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  async register(userData) {
    const { username, email, password, fullName } = userData;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409, 'CONFLICT');
    }

    const existingUsername = await User.findOne({
      where: { username }
    });

    if (existingUsername) {
      throw new AppError('Username already taken', 409, 'CONFLICT');
    }

    // Get default role (teacher)
    const teacherRole = await Role.findOne({ where: { name: 'teacher' } });

    const user = await User.create({
      username,
      email,
      password_hash: password,
      full_name: fullName,
      role_id: teacherRole?.id || null
    });

    const token = this.generateToken(user);

    return {
      user: await this.getUserWithRole(user.id),
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    if (!user.is_active) {
      throw new AppError('Account is disabled', 401, 'UNAUTHORIZED');
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    const token = this.generateToken(user);

    return {
      user: await this.getUserWithRole(user.id),
      token
    };
  }

  async getProfile(userId) {
    return this.getUserWithRole(userId);
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const { fullName, email } = updateData;

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new AppError('Email already in use', 409, 'CONFLICT');
      }
    }

    await user.update({
      ...(fullName && { full_name: fullName }),
      ...(email && { email })
    });

    return this.getUserWithRole(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const isValidPassword = await user.validatePassword(currentPassword);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400, 'VALIDATION_ERROR');
    }

    await user.update({ password_hash: newPassword });

    return { message: 'Password updated successfully' };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  async getUserWithRole(userId) {
    return User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password_hash'] }
    });
  }
}

module.exports = new AuthService();
