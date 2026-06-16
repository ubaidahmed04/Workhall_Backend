'use strict';

const logger = require('../config/logger');
const { getAllowanceTransaction , addEditAllowance} = require('../services/allowancetransaction.service');

async function AddEditAllowance(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    const result = await addEditAllowance(
      req.body,
      actorId
    );

    if (!result) {
      return res.fail(
        400,
        'Unable to save allowance'
      );
    }

    return res.success(
      result,
      result.message ||
        'Allowance saved successfully'
    );

  } catch (error) {
    logger.error(
      'AddEditAllowance Error =>',
      error
    );

    return res.fail(
      500,
      error.message ||
        'Internal Server Error'
    );
  }
}
async function GetAllAllowance(
  req,
  res
) {
  try {
    const result =
      await getAllowanceTransaction();

    if (
      result?.code ===
      'DB_CONNECTION_ERROR'
    ) {
      return res.fail(
        503,
        'Database not connected'
      );
    }

    return res.success(
      result || [],
      result?.length
        ? 'Allowance fetched successfully'
        : 'No Data Found'
    );
  } catch (error) {
    logger.error(
      'GetAllAllowance Error =>',
      error
    );

    return res.fail(
      500,
      'Internal Server Error'
    );
  }
}

module.exports = {
  AddEditAllowance,
  GetAllAllowance
};