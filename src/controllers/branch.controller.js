'use strict';

const httpStatus = require('../constants/httpStatus');
const { addBranch, getBranches } = require('../services/branch.service');

async function AddEditBranch(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addBranch(req.body, actorId);

    return res.success({
      data: result,
      message: result?.message || 'Branch saved successfully'
    });

  } catch (error) {
    console.error('AddEditBranch Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

async function getAllBranch(req, res) {
  try {
    const result = await getBranches();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(httpStatus.SERVICE_UNAVAILABLE, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Branches fetched successfully' : 'No Data Found');

  } catch (error) {
    console.error('getAllBranch Error =>', error);
    return res.fail(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
  }
}

module.exports = {
  AddEditBranch,
  getAllBranch
};
