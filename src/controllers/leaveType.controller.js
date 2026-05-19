'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditLeaveType, getLeaveTypes } = require('../services/leavetype.service');

async function AddEditLeaveType(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditLeaveType(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({
        message: result?.message || 'Failed to save leave type'
      }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Leave type saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditLeaveType Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function GetLeaveTypes(req, res) {
  try {
    const result = await getLeaveTypes();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({
        data: [],
        message: 'No Data Found'
      }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Leave types fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('GetLeaveTypes Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditLeaveType,
  GetLeaveTypes
};