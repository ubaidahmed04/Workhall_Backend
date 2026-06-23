const express = require("express");
const router = express.Router();

const { verifyOtp } = require("../controllers/verifyOtpController");

/**
 * =====================================
 * VERIFY OTP
 * =====================================
 */
router.post("/otp/verify", verifyOtp);

module.exports = router;
