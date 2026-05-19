'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditEmployee, getAllEmployee } = require('../controllers/employee.controller');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/add-edit', optionalAuth,  upload.single("vimage") , AddEditEmployee);
router.get('/get-all',   optionalAuth,  getAllEmployee);



module.exports = router;
