const express = require("express");
const router = express.Router();

const { sendOtp } = require("../controllers/sendOtpController");

router.post("/otp/send", sendOtp);

module.exports = router;
