'use strict';

const { addEditRole, getRole } = require('../services/role.service');
const logger = require('../config/logger');

async function AddEditRole(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';
    const result = await addEditRole(req.body, actorId);

    if (!result) return res.fail(404, 'No Data Found');

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to save role');
    }

    return res.success(result, result?.message || 'Role saved successfully');

  } catch (error) {
   logger.error('AddEditRole Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

async function getAllRoles(req, res) {
  try {
    const result = await getRole();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(result || [], result?.length ? 'Roles fetched successfully' : 'No Data Found');

  } catch (error) {
   logger.error('getAllRoles Error =>', error);
    return res.fail(500, 'Internal Server Error');
  }
}

module.exports = {
  AddEditRole,
  getAllRoles
};
