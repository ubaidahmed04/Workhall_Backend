const express = require("express");
const router = express.Router();

const { forgetPassword } = require("../controllers/forgetPasswordController");

/**
 * =====================================
 * FORGET PASSWORD
 * =====================================
 */
router.post("/forget-password", forgetPassword);

module.exports = router;
