'use strict';

const httpStatus = require('../constants/httpStatus');
const {addEditDepartment, getDepartment} = require('../services/department.service');

async function addEditDepart(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditDepartment(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllDepartment(req, res) {
    const result = await getDepartment();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Department fetched successfully'
    }, httpStatus.OK);
}
module.exports = {
  addEditDepart,
  getAllDepartment
};