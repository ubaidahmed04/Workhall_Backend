'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditSalaryHead, getAllSalaryHead } = require('../controllers/salaryHead.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Salary Head'),
    // authorize([1, 2, 3]),
    AddEditSalaryHead);
router.get('/get-all',   authenticate, getAllSalaryHead);



module.exports = router;
