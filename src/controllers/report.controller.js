const reportService = require("../services/report.service.js");

const getMonthReport = async (req, res) => {
  try {
    const {
      departmentId = 0,
      empId = 0,
      fromDate,
      toDate,
    } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    const data = await reportService.getMonthReport({
      departmentId: Number(departmentId),
      empId: Number(empId),
      fromDate,
      toDate,
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("getMonthReport Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMonthReport,
};