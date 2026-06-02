'use strict';

const { addEditDepartment, getDepartment } = require('../services/department.service');
const logger = require('../config/logger');

async function addEditDepart(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditDepartment(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save department');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Department saved successfully');

  } catch (error) {
    logger.error('addEditDepart Error =>', error);

    return res.fail(500, 'Internal Server Error', error);
  }
}

async function getAllDepartment(req, res) {
  try {
    const result = await getDepartment();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Department fetched successfully' : 'No Data Found');

  } catch (error) {
    logger.error('getAllDepartment Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  addEditDepart,
  getAllDepartment
};
