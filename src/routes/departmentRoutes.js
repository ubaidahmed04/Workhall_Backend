const express = require("express");
const router = express.Router();

const { getDepartments } = require("../controllers/departmentController");

/**
 * =====================================
 * GET DEPARTMENTS
 * =====================================
 */
router.get("/departments/get", getDepartments);

module.exports = router;
