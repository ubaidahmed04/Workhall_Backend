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
    service: 'nutrackx-backend',
    db
  }, 'Health check successful');
}

module.exports = { health };
