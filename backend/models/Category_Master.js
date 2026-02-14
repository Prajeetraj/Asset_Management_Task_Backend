// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Category = sequelize.define('category_master', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sort_order: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'category_master',
  timestamps: false
});

module.exports = Category;

