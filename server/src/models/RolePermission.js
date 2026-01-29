const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id'
    }
  }
}, {
  tableName: 'role_permissions',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = RolePermission;
