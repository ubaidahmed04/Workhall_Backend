const express = require("express");
const router = express.Router();

const { applyLeave } = require("../controllers/applyleave");

/**
 * APPLY / EDIT LEAVE
 */
router.post("/employee-leave/apply", applyLeave);

module.exports = router;
