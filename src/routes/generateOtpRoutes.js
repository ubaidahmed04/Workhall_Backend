const express = require("express");
const router = express.Router();

const { generateOtp } = require("../controllers/generateOtpController");

/**
 * =====================================
 * GENERATE OTP
 * =====================================
 */
router.post("/otp/generate", generateOtp);

module.exports = router;
