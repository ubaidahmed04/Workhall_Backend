'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditBranch, getAllBranch } = require('../controllers/branch.controller');

const router = express.Router();

router.post('/add-edit',  authenticate, checkAccess('Branches'),
    // authorize([1, 2, 3]),
    AddEditBranch);
router.get('/get-all', authenticate , getAllBranch);



module.exports = router;
