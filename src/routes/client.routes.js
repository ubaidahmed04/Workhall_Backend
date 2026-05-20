'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditClient, getAllClients } = require('../controllers/client.controller');

const router = express.Router();

router.post('/add-edit', authenticate,authorize([1, 2, 3]), AddEditClient);
router.get('/get-all', authenticate , getAllClients);



module.exports = router;
