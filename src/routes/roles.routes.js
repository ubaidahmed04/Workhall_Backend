'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditRole, getAllRoles } = require('../controllers/role.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditRole);
router.get('/get-all', optionalAuth , getAllRoles);



module.exports = router;
