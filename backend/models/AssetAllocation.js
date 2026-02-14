// models/AssetAllocation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = require('./Employee');
const Asset = require('./Asset');

const AssetAllocation = sequelize.define('AssetAllocation', {
  allocation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  allocated_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  allocated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'asset_allocation',
  timestamps: false
});

/* Foreign Keys */
AssetAllocation.belongsTo(Employee, {
  foreignKey: {
    name: 'employee_id',
    allowNull: false
  }
});

AssetAllocation.belongsTo(Asset, {
  foreignKey: {
    name: 'asset_id',
    allowNull: false
  }
});

module.exports = AssetAllocation;

