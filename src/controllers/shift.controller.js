'use strict';

const { addEditShifts, getShift } = require('../services/shift.service');
const logger = require('../config/logger');

async function addEditShift(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditShifts(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save shift');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Shift saved successfully');

  } catch (error) {
    logger.error('addEditDepart Error =>', error);

    return res.fail(500, 'Internal Server Error', error);
  }
}

async function getAllShift(req, res) {
  try {
    const result = await getShift();
    console.log("result",result)
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Shifts fetched successfully' : 'No Data Found');

  } catch (error) {
    logger.error('getAllShift Error =>', error);

    return res.fail(500, 'Internal Server Error', error);
  }
}

module.exports = {
  addEditShift,
  getAllShift
};
