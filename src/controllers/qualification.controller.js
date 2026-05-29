'use strict';

const { addEditQalify, getQualification } = require('../services/qualification.service');
const logger = require('../config/logger');

async function AddEditQualification(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditQalify(req.body, actorId);

    if (!result) return res.fail(404, 'No Data Found');

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save qualification');
    }

    return res.success(result, result?.message || 'Qualification saved successfully');

  } catch (error) {
   logger.error('AddEditQualification Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllQualification(req, res) {
  try {
    const result = await getQualification();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Qualification fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('getAllQualification Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditQualification,
  getAllQualification
};
