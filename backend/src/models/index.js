const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: 'mysql',
  logging: process.env.NODE_ENV !== 'development' ? console.log : false
});

const models = {
  User: require('./user')(sequelize),
  Organization: require('./organization')(sequelize),
  Service: require('./service')(sequelize),
  Incident: require('./incident')(sequelize),
  IncidentUpdate: require('./incidentUpdate')(sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };