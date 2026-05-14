'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { addEditDepart ,getAllDepartment } = require('../controllers/department.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , addEditDepart);
router.get('/get-all', optionalAuth , getAllDepartment);



module.exports = router;
