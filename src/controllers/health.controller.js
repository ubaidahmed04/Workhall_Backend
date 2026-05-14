'use strict';

const { getPool } = require('../database/oraclePool');

async function health(_req, res) {
  let db = 'down';
  try {
    getPool();
    db = 'up';
  } catch {
    db = 'down';
  }
  return res.success({
    data: { service: 'nutrackx-backend', db },
  });
}

module.exports = { health };
