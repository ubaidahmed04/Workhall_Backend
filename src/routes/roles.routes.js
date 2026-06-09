'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditRole, getAllRoles } = require('../controllers/role.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Roles'),
    // authorize([1, 2, 3]),
    AddEditRole);
router.get('/get-all',   authenticate, getAllRoles);



module.exports = router;
