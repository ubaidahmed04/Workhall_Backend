const express = require("express");
const router = express.Router();

const { getLeaveType } = require("../controllers/leaveTypeController");

// GET leave types
router.post("/leavetype/get", getLeaveType);

module.exports = router;
