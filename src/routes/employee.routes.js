'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditEmployee, getAllEmployee } = require('../controllers/employee.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditEmployee);
router.get('/get-all', optionalAuth , getAllEmployee);



module.exports = router;
