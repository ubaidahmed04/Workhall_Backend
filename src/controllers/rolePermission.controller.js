'use strict';

const logger = require('../config/logger');
const { addEditRoleWithPermissions, getModules, getRolePermissions } = require('../services/rolePerm.service.js');


async function AddEditRoleWithPermissions(req, res) {
  try {

    const actorId = req.user?.username || 'SYSTEM';

    const result = await addEditRoleWithPermissions(
      req.body,
      actorId
    );

    if (!result) {
      return res.fail(404, 'No Data Found');
    }

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(
        400,
        result?.message || 'Failed to save role'
      );
    }

    return res.success(
      result,
      result?.message || 'Role saved successfully'
    );

  } catch (error) {

    logger.error("AddEditRoleWithPermissions Error =>", {
    message: error.message,
    code: error.code,
    errorNum: error.errorNum,
  });

    return res.fail(
      500,
      error.message,
      error.code,
      error.message || 'Internal Server Error'
    );
  }
}

async function GetRolePermissions(req, res) {
  try {

    const { roleid } = req.query;

    if (!roleid) {
      return res.fail(400, 'Role Id is required');
    }

    const result = await getRolePermissions(roleid);

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(
      result || [],
      result?.length
        ? 'Permissions fetched successfully'
        : 'No Data Found'
    );

  } catch (error) {

    logger.error('GetRolePermissions Error =>', error);

    return res.fail(
      500,
      'Internal Server Error'
    );
  }
}

async function GetModules(req, res) {
  try {

    const result = await getModules();

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    return res.success(
      result || [],
      result?.length
        ? 'Modules fetched successfully'
        : 'No Data Found'
    );

  } catch (error) {

    logger.error('GetModules Error =>', error);

    return res.fail(
      500,
      'Internal Server Error'
    );
  }
}

module.exports = {
  AddEditRoleWithPermissions,
  GetModules,
  GetRolePermissions
};