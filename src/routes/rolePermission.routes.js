const express = require('express');
const { AddEditRoleWithPermissions, GetModules, GetRolePermissions } = require('../controllers/rolePermission.controller');
const { getModules } = require('../services/rolePerm.service');
const authorize = require('../middleware/authorize.middleware');
const router = express.Router();


router.post( '/add-edit', authorize, AddEditRoleWithPermissions );
router.get( '/get-all',   authorize, GetModules );
router.get('/permissions',authorize, GetRolePermissions );
module.exports = router;