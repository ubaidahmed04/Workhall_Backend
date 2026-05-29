'use strict';

const { addEditDesig, getDesignation } = require('../services/designation.service');
const logger = require('../config/logger');

async function addEditDesignation(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditDesig(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save designation');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Designation saved successfully');

  } catch (error) {
    logger.error('addEditDesignation Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllDesignation(req, res) {
  try {
    const result = await getDesignation();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Designation fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('getAllDesignation Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  addEditDesignation,
  getAllDesignation
};
