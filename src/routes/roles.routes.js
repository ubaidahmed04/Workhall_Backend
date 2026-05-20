'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditRole, getAllRoles } = require('../controllers/role.controller');

const router = express.Router();

router.post('/add-edit', authenticate, authorize([1, 2, 3]), AddEditRole);
router.get('/get-all',   authenticate, getAllRoles);



module.exports = router;
