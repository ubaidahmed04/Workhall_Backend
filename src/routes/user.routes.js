'use strict';

const express = require('express');
const { optionalAuth } = require('../middleware/auth.middleware');
const { addUserProfile , getAllUsers} = require('../controllers/userprofile.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , addUserProfile);
router.get('/get-all', optionalAuth , getAllUsers);


module.exports = router;
