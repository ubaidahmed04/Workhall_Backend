'use strict';

const httpStatus = require('../constants/httpStatus');
const { addBranch, getBranches } = require('../services/branch.service');

async function AddEditBranch(req, res) {
  try {
    const actorId = req.user?.userid || 'SYSTEM';

    const result = await addBranch(req.body, actorId);

    // No response from service
    if (!result) {
      return res.error({
        message: 'No Data Found'
      }, httpStatus.NOT_FOUND);
    }

    // Database / connection issue handling
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    // Validation or custom service error
    if (result?.status === false) {
      return res.error({
        message: result?.message || 'Failed to save branch'
      }, httpStatus.BAD_REQUEST);
    }

    return res.success({
      data: result,
      message: result?.message || 'Branch saved successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('AddEditBranch Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getAllBranch(req, res) {
  try {

    const result = await getBranches();

    // Database connection issue
    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.error({
        message: 'Network Error! Database not connected'
      }, httpStatus.SERVICE_UNAVAILABLE);
    }

    // No data found
    if (!result || result.length === 0) {
      return res.success({
        data: [],
        message: 'No Data Found'
      }, httpStatus.OK);
    }

    return res.success({
      data: result,
      message: 'Branches fetched successfully'
    }, httpStatus.OK);

  } catch (error) {
    console.log('getAllBranch Error =>', error);

    return res.error({
      message: 'Internal Server Error'
    }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  AddEditBranch,
  getAllBranch
};