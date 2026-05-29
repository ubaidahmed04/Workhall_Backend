'use strict';

const { addEditHoliday, getHoliday } = require('../services/holiday.service');
const logger = require('../config/logger');

async function AddEditHoliday(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditHoliday(req.body, actorId);

    if (!result) return res.fail(404, 'No Data Found');

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save holiday');
    }

    return res.success(result, result?.message || 'Holiday saved successfully');

  } catch (error) {
   logger.error('AddEditHoliday Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllHoliday(req, res) {
  try {
    const result = await getHoliday();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Holiday fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('getAllHoliday Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditHoliday,
  getAllHoliday
};
