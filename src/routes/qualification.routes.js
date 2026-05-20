'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const {  AddEditQualification , getAllQualification} = require('../controllers/qualification.controller');

const router = express.Router();

router.post('/add-edit', authenticate, authorize([1, 2, 3]), AddEditQualification);
router.get('/get-all',   authenticate, getAllQualification);



module.exports = router;
