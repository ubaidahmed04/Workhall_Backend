const express = require('express');
const { AddEditRoleWithPermissions, GetModules, GetRolePermissions } = require('../controllers/rolePermission.controller');
const { getModules } = require('../services/rolePerm.service');
const authorize = require('../middleware/authorize.middleware');
const router = express.Router();


router.post('/add-edit',  AddEditRoleWithPermissions );
router.get( '/get-all',    GetModules );
router.get('/permissions', GetRolePermissions );
module.exports = router;