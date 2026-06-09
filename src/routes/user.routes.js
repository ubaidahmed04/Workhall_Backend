'use strict';

const express = require('express');
const { optionalAuth, authenticate } = require('../middleware/auth.middleware');
const { addUserProfile , getAllUsers} = require('../controllers/userprofile.controller');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Users'),
    // authorize([1, 2, 3]),
    addUserProfile);
router.get('/get-all',   authenticate, getAllUsers);


module.exports = router;
