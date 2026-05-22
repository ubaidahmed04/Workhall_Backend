// routes/dailyWorksheet.routes.js

const express = require("express");
const router = express.Router();
const { getDailyWorksheet, } = require("../controllers/dailyWorksheet.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/get-all",   authenticate,getDailyWorksheet);

module.exports = router;