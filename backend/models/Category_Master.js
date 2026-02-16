// models/Category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category_Master = sequelize.define(
  "Category_Master",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      sort_order: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "category_master",
    timestamps: false,
  }
);

module.exports = Category_Master;


