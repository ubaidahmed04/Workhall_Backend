'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditDepartment, getDepartment } = require('../services/department.service');

async function addEditDepart(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditDepartment(req.body, actorId);

    if (!result) {
      return res.error({ message: 'No Data Found' }, httpStatus.NOT_FOUND);
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (result?.status === false) {
      return res.error({ message: result?.message || 'Failed to save department' }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Department saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('addEditDepart Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllDepartment(req, res) {
  try {
    const result = await getDepartment();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({ message: 'Network Error! Database not connected' }, httpStatus.SERVICE_UNAVAILABLE);
    }

    if (!result || result.length === 0) {
      return res.success({ data: [], message: 'No Data Found' }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Department fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllDepartment Error =>', error);
    return res.error({ message: 'Internal Server Error' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  addEditDepart,
  getAllDepartment
};