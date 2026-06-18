'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditPayrollStructure, GetAllPayrollStructure } = require('../controllers/payrollStructure.controller');
const { GetSalaryStructureByEmployee } = require('../controllers/payroll.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Category'),
    // authorize([1, 2, 3]),
    AddEditPayrollStructure);
router.get('/get-all',   authenticate, GetAllPayrollStructure);
router.get('/get-by-emp',   authenticate, GetSalaryStructureByEmployee);



module.exports = router;
