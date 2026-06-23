const express = require("express");
const router = express.Router();

const {
  checkInAttendance,
  checkOutAttendance,
} = require("../controllers/markAttendanceController");


router.post("/attendance/check-in", checkInAttendance);


router.post("/attendance/check-out", checkOutAttendance);

module.exports = router;
