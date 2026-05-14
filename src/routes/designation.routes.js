'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { addEditDesignation,getAllDesignation } = require('../controllers/designation.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , addEditDesignation);
router.get('/get-all', optionalAuth , getAllDesignation);



module.exports = router;
