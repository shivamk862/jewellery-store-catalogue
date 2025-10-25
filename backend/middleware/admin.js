
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin resource. Access denied.' });
  }
  next();
};
