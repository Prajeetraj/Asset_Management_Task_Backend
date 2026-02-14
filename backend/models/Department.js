// models/Department.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Department = sequelize.define('department_master', {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sort_order: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'department_master',
  timestamps: false
});

module.exports = Department;

