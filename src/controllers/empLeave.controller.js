'use strict';

const { addEditEmpLeave, getEmpLeaves } = require('../services/empLeave.service');
const logger = require('../config/logger');

async function AddEditEmpLeave(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditEmpLeave(req.body, actorId);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save employee leave');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(result, result?.message || 'Employee leave saved successfully');

  } catch (error) {
   logger.error('AddEditEmpLeave Error =>', error);

    return res.fail(500, 'Internal Server Error', error);
  }
}

async function GetEmpLeaves(req, res) {
  try {
    const result = await getEmpLeaves();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Employee leaves fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('GetEmpLeaves Error =>', error);

    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditEmpLeave,
  GetEmpLeaves
};
