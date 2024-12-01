const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
require('dotenv').config();

/**
 * Auth0 service
 * @param {import('express').Application} app 
 */
module.exports = function (app) {
  /**
   * @type {import('express-openid-connect').ConfigParams}
   */
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: `${process.env.APP_URL}:${process.env.APP_PORT}`,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN
  };

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));

  // req.isAuthenticated is provided from the auth router
  app.get('/isLoggedIn', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
}