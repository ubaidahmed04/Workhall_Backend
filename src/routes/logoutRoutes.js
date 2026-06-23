const express = require("express");
const router = express.Router();

const { logoutApp } = require("../controllers/logoutController");

/**
 * =====================================
 * LOGOUT APP USER
 * =====================================
 */
router.post("/logout", logoutApp);

module.exports = router;
