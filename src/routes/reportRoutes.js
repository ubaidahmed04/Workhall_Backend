const express = require("express");
const router = express.Router();

const { getMonthReport } = require("../controllers/reportController");

router.post("/month-report", getMonthReport);

module.exports = router;
