'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { GetAllAllowance, AddEditAllowance, GetAllowanceReport } = require('../controllers/allowanceTransaction.controller');

const router = express.Router();

router.post('/add-edit',  authenticate, checkAccess('Allowance'),
    // authorize([1, 2, 3]),
    AddEditAllowance);
router.get('/get-all', authenticate , GetAllAllowance);
router.get('/allowance-report', authenticate , GetAllowanceReport);



module.exports = router;
