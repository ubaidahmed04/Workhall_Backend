'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditHoliday , getAllHoliday} = require('../controllers/holiday.controller');

const router = express.Router();

router.post('/add-edit', authenticate, authorize([1, 2, 3]), AddEditHoliday);
router.get('/get-all',   authenticate, getAllHoliday);



module.exports = router;
