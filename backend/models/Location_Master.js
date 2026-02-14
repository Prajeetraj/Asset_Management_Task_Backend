// models/Location.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Location = sequelize.define('Location_master', {
  location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  location_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sort_order: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'location_master',
  timestamps: false
});

module.exports = Location;
