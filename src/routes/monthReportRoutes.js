const express = require("express");
const router = express.Router();

const { getMonthReport } = require("../controllers/monthReportController");

/**
 * =====================================
 * GET MONTH REPORT
 * =====================================
 */
router.post("/month-report/get", getMonthReport);

module.exports = router;
