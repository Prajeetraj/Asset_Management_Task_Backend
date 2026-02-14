const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('taskk', 'postgres', 'P23', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('PostgreSQL Connected'))
  .catch(err => console.error('DB Error:', err));

module.exports = sequelize;
