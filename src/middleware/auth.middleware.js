'use strict';

const jwt = require('../utils/jwt.util');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new ApiError(401, 'Token required');
    }

    const token = header.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Invalid token format');
    }

    const user = jwt.verifyAccessToken(token);

    req.user = user;

    next();

  } catch (err) {
    next(new ApiError(401, 'Unauthorized'));
  }
}
function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) return next();

    const token = header.split(' ')[1];

    req.user = jwt.verifyAccessToken(token);

  } catch {
    req.user = null;
  }

  next();
}

module.exports = { optionalAuth, authenticate };