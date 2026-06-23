const express = require("express");
const router = express.Router();

const { getBranch } = require("../controllers/getBranchController");

// GET BRANCH LIST
router.get("/branch", getBranch);

module.exports = router;
