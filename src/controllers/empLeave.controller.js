'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditEmpLeave, getEmpLeaves } = require('../services/empLeave.service');

async function AddEditEmpLeave(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditEmpLeave(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({ message: result?.message || 'Failed to save employee leave' }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Employee leave saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditEmpLeave Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function GetEmpLeaves(req, res) {
  try {
    const result = await getEmpLeaves();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({ data: [], message: 'No Data Found' }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Employee leaves fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('GetEmpLeaves Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditEmpLeave,
  GetEmpLeaves
};