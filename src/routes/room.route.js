'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditRoom, GetAllRoom } = require('../controllers/room.controller');

const router = express.Router();

router.post('/add-edit',  authenticate, checkAccess('Rooms'),
    // authorize([1, 2, 3]),
    AddEditRoom);
router.get('/get-all', authenticate , GetAllRoom);



module.exports = router;
