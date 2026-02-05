const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true
});

Role.associate = (models) => {
  Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
  Role.belongsToMany(models.Permission, { 
    through: models.RolePermission, 
    foreignKey: 'role_id', 
    otherKey: 'permission_id',
    as: 'permissions' 
  });
};

module.exports = Role;
