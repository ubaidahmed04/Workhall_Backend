'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { addEditShift, getAllShift } = require('../controllers/shift.controller');

const router = express.Router();

router.post('/add-edit', authenticate, authorize([1, 2, 3]), addEditShift);
router.get('/get-all', authenticate, getAllShift);



module.exports = router;
