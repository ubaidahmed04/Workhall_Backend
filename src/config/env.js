'use strict';

const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().integer().default(3000),
  API_VERSION: Joi.string().default('v1'),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('8h'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_CONNECT_STRING: Joi.string().required(),
  ORACLE_POOL_MIN: Joi.number().integer().min(0).default(2),
  ORACLE_POOL_MAX: Joi.number().integer().min(1).default(20),
  ORACLE_POOL_INCREMENT: Joi.number().integer().min(1).default(2),
  ORACLE_STMT_CACHE_SIZE: Joi.number().integer().min(0).default(30),
  ORACLE_QUEUE_TIMEOUT: Joi.number().integer().min(0).default(60000),
  ORACLE_POOL_TIMEOUT: Joi.number().integer().min(0).default(60),

  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE_MB: Joi.number().integer().min(1).default(10),
}).unknown(true);

let cached;

function assertEnv() {
  const { error, value } = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
  if (error) {
    const msg = error.details.map((d) => d.message).join('; ');
    throw new Error(`Environment validation failed: ${msg}`);
  }
  cached = value;
  return cached;
}

function getEnv() {
  if (!cached) {
    assertEnv();
  }
  return cached;
}

module.exports = {
  get env() {
    return getEnv();
  },
  assertEnv,
};
