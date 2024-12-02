const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const routes = require('./routes');
const pkgJson = require('../package.json');
const cors = require('cors');
process.env.NODE_ENV = pkgJson.config.NODE_ENV;

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').filter(Boolean) : '*'
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});