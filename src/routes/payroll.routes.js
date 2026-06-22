'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditPayslip, GetPayslip, GetPayslipById, DeletePayslip } = require('../controllers/payroll.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Payroll'),
    // authorize([1, 2, 3]),
    AddEditPayslip);
router.get('/get-all',   authenticate, GetPayslip);
router.get('/getById',   authenticate, GetPayslipById);
router.delete('/delete',   authenticate, DeletePayslip);



module.exports = router;
