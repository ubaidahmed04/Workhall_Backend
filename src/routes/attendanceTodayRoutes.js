const express = require("express");
const router = express.Router();

const {
  getAttendanceToday,
} = require("../controllers/attendanceTodayController");

/**
 * =====================================
 * GET ATTENDANCE TODAY
 * =====================================
 */
router.get("/attendance-today/get", getAttendanceToday);

module.exports = router;
