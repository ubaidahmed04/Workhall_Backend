// controllers/dailyWorksheet.controller.js

const dailyWorksheetService = require("../services/dailyWorksheet.service");
const logger = require('../config/logger');

async function getDailyWorksheet(req, res) {
  try {

    const data = await dailyWorksheetService.getDailyWorksheet();

    return res.success(data, "Daily worksheet fetched successfully");

  } catch (err) {

    logger.error("Get Daily Worksheet Error =>", err);

    return res.fail(500, "Internal Server Error");
  }
}

const getEmpWorksheet = async (req, res) => {
  try {
    const { empId, fromDate, toDate } = req.query;

    const result = await dailyWorksheetService.getDailyWorksheetEmp(
      empId,
      fromDate,
      toDate
    );

    if (result?.code === 'DB_CONNECTION_ERROR') {
      return res.fail(503, 'Database not connected');
    }

    if (result?.status === false) {
      return res.fail(400, result?.message || 'Failed to fetch worksheet');
    }

    if (result === null || result === undefined) {
      return res.fail(404, 'No Data Found');
    }

    return res.success(
      result,
      'Daily worksheet fetched successfully'
    );

  } catch (error) {
    logger.error('getEmpWorksheet Error =>', error);

    return res.fail(
      500,
      error.message || 'Internal Server Error'
    );
  }
};

module.exports = {
  getDailyWorksheet,
  getEmpWorksheet
};
