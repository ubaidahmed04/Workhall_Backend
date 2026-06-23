const express = require("express");
const router = express.Router();

const {
  getAllEmployeeLeaves,
} = require("../controllers/allempleavecontroller");

/**
 * =====================================
 * GET ALL EMPLOYEE LEAVES
 * =====================================
 */
router.get("/employee-leaves/get", getAllEmployeeLeaves);

module.exports = router;
