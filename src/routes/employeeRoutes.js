const express = require("express");
const router = express.Router();

const { getEmployees } = require("../controllers/getEmployeeController");

// GET EMPLOYEE LIST
router.post("/employee/get", getEmployees);

module.exports = router;
