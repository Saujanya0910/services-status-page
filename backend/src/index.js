const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const routes = require('./routes');
const pkgJson = require('../package.json');
process.env.NODE_ENV = pkgJson.config.NODE_ENV;

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use('/api', routes);

const auth0Service = require('./services/auth0');
auth0Service(app);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});