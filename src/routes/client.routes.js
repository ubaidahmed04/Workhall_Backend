'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditClient, getAllClients } = require('../controllers/client.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditClient);
router.get('/get-all', optionalAuth , getAllClients);



module.exports = router;
