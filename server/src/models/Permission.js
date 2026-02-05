const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  resource: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  action: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  underscored: true
});

Permission.associate = (models) => {
  Permission.belongsToMany(models.Role, { 
    through: models.RolePermission, 
    foreignKey: 'permission_id', 
    otherKey: 'role_id',
    as: 'roles' 
  });
};

module.exports = Permission;
