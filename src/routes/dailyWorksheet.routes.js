// routes/dailyWorksheet.routes.js

const express = require("express");
const router = express.Router();
const { getDailyWorksheet, getEmpWorksheet } = require("../controllers/dailyWorksheet.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/get-all",   authenticate,getDailyWorksheet);
router.get("/report", authenticate, getEmpWorksheet );
module.exports = router;