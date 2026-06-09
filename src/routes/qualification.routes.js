'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const {  AddEditQualification , getAllQualification} = require('../controllers/qualification.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Qualification'),
    // authorize([1, 2, 3]),
    AddEditQualification);
router.get('/get-all',   authenticate, getAllQualification);



module.exports = router;
