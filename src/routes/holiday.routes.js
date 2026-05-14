'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditHoliday , getAllHoliday} = require('../controllers/holiday.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditHoliday);
router.get('/get-all', optionalAuth , getAllHoliday);



module.exports = router;
