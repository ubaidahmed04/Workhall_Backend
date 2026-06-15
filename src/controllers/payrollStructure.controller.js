'use strict';

const logger = require('../config/logger');
const { addEditpayollStructure, getPayrollStructure,  } = require('../services/payrollStructure.service');

async function AddEditPayrollStructure(req, res) {
  try {
    const actorId = req.user?.username || 'SYSTEM';

    const result = await addEditpayollStructure(
      req.body,
      actorId
    );

    if (!result) {
      return res.fail(400, 'Unable to save Payroll Structure');
    }

    if (result.status === false) {
      return res.fail(400, result.message);
    }

    return res.success(
      result,
      result.message || 'Payroll Structure saved successfully'
    );
  } catch (error) {
    logger.error('AddEditPayrollStructure Error =>', error);

    return res.fail(
      500,
      error.message || 'Internal Server Error'
    );
  }
}

async function GetAllPayrollStructure(req, res) {
  try {
    const result = await getPayrollStructure();

    return res.success(
      result || [],
      result?.length
        ? "Payroll Structure fetched successfully"
        : "No Data Found"
    );
  } catch (error) {
    logger.error("GetAllPayrollStructure Error =>", error);

    return res.fail(
      500,
      error.message || "Internal Server Error"
    );
  }
}

module.exports = {
  AddEditPayrollStructure,
  GetAllPayrollStructure
};