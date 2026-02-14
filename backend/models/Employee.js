// models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Department = require('./Department');
const Location = require('./Location_Master');

const Employee = sequelize.define('employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sort_order: DataTypes.INTEGER,
  status: DataTypes.STRING
}, {
  tableName: 'employee',
  timestamps: false
});

/* Foreign Keys */
Employee.belongsTo(Department, {
  foreignKey: {
    name: 'department_id',
    allowNull: false
  }
});

Employee.belongsTo(Location, {
  foreignKey: {
    name: 'location_id',
    allowNull: false
  }
});

module.exports = Employee;

