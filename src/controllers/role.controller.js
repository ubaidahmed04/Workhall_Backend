'use strict';

const httpStatus = require('../constants/httpStatus');
const { addEditRole, getRole } = require('../services/role.service');

async function AddEditRole(req, res) {
  const actorId = req.user?.userid || "SYSTEM";

  const result = await addEditRole(req.body, actorId);

  return res.success({
    data: result,
    message: result?.message
  }, httpStatus.OK);
}

async function getAllRoles(req, res) {
    const result = await getRole();
    if (!result || result.length === 0) {
        return res.success({
            data: [],
            message: 'No Data Found'
        }, httpStatus.OK);
    }
    return res.success({
        data: result,
        message: 'User Role fetched successfully'
    }, httpStatus.OK);
}

module.exports = {
  AddEditRole,
  getAllRoles
};