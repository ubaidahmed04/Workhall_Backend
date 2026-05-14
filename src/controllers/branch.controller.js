'use strict';

const httpStatus = require('../constants/httpStatus');
const { addBranch ,getBranches} = require('../services/branch.service');

async function AddEditBranch(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addBranch(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllBranch(req, res) {
    const result = await getBranches();
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
}

module.exports = {
  AddEditBranch,
  getAllBranch
};