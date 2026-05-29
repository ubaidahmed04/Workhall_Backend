'use strict';

const jwt = require('../utils/jwt.util');
const ApiError = require('../utils/ApiError');
const JWT_SECRET = process.env.JWT_SECRET;
function authenticate(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.fail(401, "Token required");
  }
  try {
    const decoded = jwt.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.fail(401, "Invalid or expired token");
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
