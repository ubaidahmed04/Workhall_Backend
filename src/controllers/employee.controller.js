'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditEmp ,getEmployees} = require('../services/employee.service');

async function AddEditEmployee(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditEmp(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllEmployee(req, res) {
    const result = await getEmployees();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'Employees fetched successfully'
    }, httpStatus.OK);
}

module.exports = {
  AddEditEmployee,
  getAllEmployee
};