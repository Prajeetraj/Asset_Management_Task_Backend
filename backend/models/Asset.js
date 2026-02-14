// models/Asset.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Category = require('./Category_Master');
const TrackType = require('./Asset_Track_Type_Master');

const Asset = sequelize.define('Asset_Track_Type_master', {
  asset_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asset_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: DataTypes.STRING,
  model: DataTypes.STRING,
  connection_type: DataTypes.STRING,
  total_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: DataTypes.STRING
}, {
  tableName: 'asset_master',
  timestamps: false
});

/* Foreign Keys */
Asset.belongsTo(Category, {
  foreignKey: {
    name: 'category_id',
    allowNull: false
  }
});

Asset.belongsTo(TrackType, {
  foreignKey: {
    name: 'track_type',
    allowNull: false
  }
});

module.exports = Asset;

