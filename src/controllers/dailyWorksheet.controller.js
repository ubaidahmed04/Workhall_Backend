// controllers/dailyWorksheet.controller.js

const dailyWorksheetService = require("../services/dailyWorksheet.service");

async function getDailyWorksheet(req, res) {
  try {

    const data = await dailyWorksheetService.getDailyWorksheet();

    return res.status(200).json({
      status: true,
      message: "Daily worksheet fetched successfully",
      data,
    });

  } catch (err) {

    console.log("Get Daily Worksheet Error =>", err);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getDailyWorksheet,
};