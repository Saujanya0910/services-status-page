const { User } = require("../models");

/**
 * Auth middleware
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const userAuthMiddleware = async (req, res, next) => {
  const reqUrl = req.originalUrl;
  if(reqUrl.includes('public')) {
    return next();
  }

  const userIdentifier = req.get('X-User-Id');
  if (!userIdentifier) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const user = await User.findOne({ where: { uuid: userIdentifier, isActive: true } });
  req.userId = user.id;
  return next();
}

module.exports = userAuthMiddleware;