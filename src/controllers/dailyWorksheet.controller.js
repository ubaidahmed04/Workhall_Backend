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

module.exports = {
  getDailyWorksheet,
};
