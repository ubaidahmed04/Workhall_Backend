'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditRent, GetRentDetailAvail, GetRentDetail } = require('../controllers/rent.controller');

const router = express.Router();

router.post('/add-edit',  authenticate, checkAccess('Workspace Rental'),
    // authorize([1, 2, 3]),
    AddEditRent);
router.get('/get-all', authenticate , GetRentDetail);
router.get('/getRent', authenticate , GetRentDetailAvail);



module.exports = router;
