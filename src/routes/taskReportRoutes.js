const express = require("express");
const router = express.Router();

const { getTaskReport } = require("../controllers/taskReportController");

/**
 * =====================================
 * GET TASK REPORT
 * =====================================
 */
router.post("/task-report/get", getTaskReport);

module.exports = router;
