const express = require("express");
const router = express.Router();

const { getPayslip } = require("../controllers/payslipController");

/**
 * =====================================
 * GET PAYSLIP
 * =====================================
 */
router.post("/payslip/get", getPayslip);

module.exports = router;
