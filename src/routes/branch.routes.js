'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditBranch, getAllBranch } = require('../controllers/branch.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditBranch);
router.get('/get-all', optionalAuth , getAllBranch);



module.exports = router;
