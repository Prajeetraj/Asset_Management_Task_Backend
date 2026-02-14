// models/TrackType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TrackType = sequelize.define('asset_track_type_master', {
  track_type: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  sort_order: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'asset_track_type_master',
  timestamps: false
});

module.exports = TrackType;

