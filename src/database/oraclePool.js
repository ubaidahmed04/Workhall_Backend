'use strict';

const oracledb = require('oracledb');
const { env } = require('../config/env');
const logger = require('../config/logger');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false;

oracledb.initOracleClient({
    libDir:"/cloudclusters/instantclient_23_5" // for production 
    // libDir:"../../Oracle/instantclient_21_3" // for local 
})
let pool;

/**
 * Initializes a shared connection pool (production: call once at startup).
 */
async function initPool() {
  if (pool) return pool;

  try {
    pool = await oracledb.createPool({
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectString: env.DB_CONNECT_STRING,
      poolMin: env.ORACLE_POOL_MIN,
      poolMax: env.ORACLE_POOL_MAX,
      poolIncrement: env.ORACLE_POOL_INCREMENT,
      // stmtCacheSize: env.ORACLE_STMT_CACHE_SIZE,
      // queueTimeout: env.ORACLE_QUEUE_TIMEOUT,
    //   poolTimeout: env.ORACLE_POOL_TIMEOUT,
    //   enableStatistics: env.NODE_ENV !== 'production',
    });
    logger.info('Oracle connection pool created');
  } catch (err) {
    logger.error('Failed to create Oracle pool', { err: err.message });
    throw err;
  }

  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error('Oracle pool not initialized. Call initPool() first.');
  }
  return pool;
}

/**
 * Executes work with a pooled connection; always releases the connection.
 * @param {function(import('oracledb').Connection): Promise<any>} fn
 */
async function withConnection(fn) {
  const connection = await getPool().getConnection();
  try {
    return await fn(connection);
  } finally {
    try {
      await connection.close();
    } catch (closeErr) {
      logger.warn('Error closing Oracle connection', { message: closeErr.message });
    }
  }
}

/**
 * Runs fn inside a transaction (commit on success, rollback on error).
 * @param {function(import('oracledb').Connection): Promise<any>} fn
 */
async function withTransaction(fn) {
  const connection = await getPool().getConnection();
  try {
    const result = await fn(connection);
    await connection.commit();
    return result;
  } catch (err) {
    try {
      await connection.rollback();
    } catch (rbErr) {
      logger.error('Rollback failed', { message: rbErr.message });
    }
    throw err;
  } finally {
    try {
      await connection.close();
    } catch (closeErr) {
      logger.warn('Error closing Oracle connection after transaction', { message: closeErr.message });
    }
  }
}

async function closePool() {
  if (!pool) return;
  try {
    await pool.close(10);
    logger.info('Oracle pool closed');
  } finally {
    pool = undefined;
  }
}

module.exports = {
  initPool,
  getPool,
  withConnection,
  withTransaction,
  closePool,
};
