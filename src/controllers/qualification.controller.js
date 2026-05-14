'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditQalify, getQualification } = require('../services/qualification.service');

async function AddEditQualification(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditQalify(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}
async function getAllQualification(req, res) {
    const result = await getQualification();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Qualification fetched successfully'
    }, httpStatus.OK);
}

module.exports = {
  AddEditQualification,
  getAllQualification
};