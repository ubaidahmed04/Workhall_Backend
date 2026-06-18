'use strict';

const logger = require('../config/logger');
const { getSalaryStructureByEmp, addEditPayslipService, getPayslipService, getPayslipById, softDeletePayslipService } = require('../services/payroll.service');

async function AddEditPayslip(req, res) {
  try {
    const {
      vpayslipid,
      vfk_empid,
      vfk_departmentid,
      vfk_salaryheadsid,
      vearning,
      vdeduction,
      vchequeno,
      vmonthName,
      vyear,
      vpaydate,
      vstatus,
      entries
    } = req.body;

    const vcreatedby = req.user?.username || "system";

    const result = await addEditPayslipService({
      vpayslipid,
      vfk_empid,
      vfk_departmentid,
      vfk_salaryheadsid,
      vearning,
      vdeduction,
      vchequeno,
      vmonthName,
      vyear,
      vpaydate,
      vstatus,
      vcreatedby,
      entries
    });

    return res.success(result, result?.message || "Success");
  } catch (error) {
    console.error("AddEditPayslip Error:", error);
    return res.fail(500, error.message || "Internal Server Error");
  }
}

async function GetPayslip(req, res) {
  const {empid, month} = req.query
  try {
    const result = await getPayslipService(empid, month);

    return res.success(
      result,
      "Payslip fetched successfully"
    );
  } catch (error) {
    logger.error("GetPayslip Error =>", error);

    return res.fail(
      500,
      error.message || "Internal Server Error"
    );
  }
}

async function GetPayslipById(req, res) {
  const {empid, month ,year } = req.query
  try {
    const result = await getPayslipById(empid, month, year);

    return res.success(
      result,
      "Payslip fetched successfully"
    );
  } catch (error) {
    logger.error("GetPayslip Error =>", error);

    return res.fail(
      500,
      error.message || "Internal Server Error"
    );
  }
}

async function DeletePayslip(req, res) {
  try {
    const { vfk_empid, vmonthName, vyear } = req.query;
    const result = await softDeletePayslipService({ vfk_empid, vmonthName, vyear });
    return res.success(result, result.message);
  } catch (error) {
    return res.fail(500, error.message || "Internal Server Error");
  }
}

async function GetSalaryStructureByEmployee(req, res) {
  try {
    const { vempid } = req.query; // or req.query

    const result = await getSalaryStructureByEmp(vempid);

    if (!result || result.length === 0) {
      return res.success([], 'No salary structure found for employee');
    }

    return res.success(result, 'Salary structure fetched successfully');
  } catch (error) {
    logger.error('GetSalaryStructureByEmployee Error =>', error);

    return res.fail(
      500,
      error.message || 'Internal Server Error'
    );
  }
}

module.exports = {
  AddEditPayslip,
  GetPayslip,
  GetPayslipById,
  DeletePayslip,
  GetSalaryStructureByEmployee
};