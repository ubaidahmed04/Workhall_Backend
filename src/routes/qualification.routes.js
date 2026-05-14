'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const {  AddEditQualification , getAllQualification} = require('../controllers/qualification.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditQualification);
router.get('/get-all', optionalAuth , getAllQualification);



module.exports = router;
