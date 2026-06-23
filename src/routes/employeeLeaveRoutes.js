const express = require("express");
const router = express.Router();

const {
  getEmployeeLeaveMobile,
} = require("../controllers/employeeLeaveController");

router.post("/employee-leave/mobile", getEmployeeLeaveMobile);

module.exports = router;
