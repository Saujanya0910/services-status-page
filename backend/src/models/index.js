const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
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