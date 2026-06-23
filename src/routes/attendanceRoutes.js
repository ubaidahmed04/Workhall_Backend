const express = require("express");
const router = express.Router();

const { getAttendanceAccess } = require("../controllers/attendanceaccess");

router.post("/attendance-access", getAttendanceAccess);

module.exports = router;
