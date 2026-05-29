'use strict';

const { addEditLeaveType, getLeaveTypes } = require('../services/leavetype.service');
const logger = require('../config/logger');

async function AddEditLeaveType(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditLeaveType(req.body, actorId);

    if (!result) return res.fail(404, 'No Data Found');

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save leave type');
    }

    return res.success(result, result?.message || 'Leave type saved successfully');

  } catch (error) {
   logger.error('AddEditLeaveType Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function GetLeaveTypes(req, res) {
  try {
    const result = await getLeaveTypes();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Leave types fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('GetLeaveTypes Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditLeaveType,
  GetLeaveTypes
};
