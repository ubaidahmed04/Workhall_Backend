const express = require("express");
const router = express.Router();

const {
  getRolePermissions,
} = require("../controllers/rolePermissionController");

/**
 * =====================================
 * GET ROLE PERMISSIONS
 * =====================================
 */
router.post("/role-permissions/get", getRolePermissions);

module.exports = router;
