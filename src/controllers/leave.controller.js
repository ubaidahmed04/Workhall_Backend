'use strict';

const { addEditLeave, getLeaves } = require('../services/leave.service');
const logger = require('../config/logger');

async function AddEditLeave(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditLeave(req.body, actorId);

    if (!result) return res.fail(404, 'No Data Found');

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save leave');
    }

    return res.success(result, result?.message || 'Leave saved successfully');

  } catch (error) {
   logger.error('AddEditLeave Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function GetLeaves(req, res) {
  try {
    const result = await getLeaves();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Leaves fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('GetLeaves Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditLeave,
  GetLeaves
};
