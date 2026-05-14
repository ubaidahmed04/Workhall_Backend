'use strict';

const httpStatus = require('../constants/httpStatus');

function notFoundHandler(req, res) {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    code: httpStatus.NOT_FOUND,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFoundHandler;
