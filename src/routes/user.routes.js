'use strict';

const express = require('express');
const { optionalAuth } = require('../middleware/auth.middleware');
const { addEditUserProfile } = require('../services/userprofile.service');

const router = express.Router();

router.post('/add-edit', optionalAuth , addEditUserProfile);


module.exports = router;
