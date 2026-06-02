const express = require("express");
const { getMonthReport } = require("../controllers/report.controller");
const router = express.Router();


router.get( "/attendance-report", getMonthReport );

module.exports = router;