'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditDesig, getDesignation } = require('../services/designation.service');

async function addEditDesignation(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditDesig(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}
async function getAllDesignation(req, res) {
    const result = await getDesignation();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Designation fetched successfully'
    }, httpStatus.OK);
}

module.exports = {
  addEditDesignation,
  getAllDesignation
};