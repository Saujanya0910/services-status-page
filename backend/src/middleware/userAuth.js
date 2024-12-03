const { User } = require("../models");

const userAuthMiddleware = async (req, res, next) => {
  const userIdentifier = req.get('X-User-Id');
  if (!userIdentifier) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const user = await User.findOne({ where: { uuid: userIdentifier } });
  req.userId = user.id;
  return next();
}

module.exports = userAuthMiddleware;