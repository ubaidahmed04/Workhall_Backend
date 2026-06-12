'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { getAllProject, AddEditProject } = require('../controllers/project.controller');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Category'),
    // authorize([1, 2, 3]),
    AddEditProject);
router.get('/get-all',   authenticate, getAllProject);



module.exports = router;
