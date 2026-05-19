'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditRole, getRole } = require('../services/role.service');

async function AddEditRole(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';
    const result = await addEditRole(req.body, actorId);

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
        message: result?.message || 'Failed to save role'
      }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Role saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditRole Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllRoles(req, res) {
  try {
    const result = await getRole();

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
      message: 'User roles fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllRoles Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditRole,
  getAllRoles
};