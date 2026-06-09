'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { AddEditEmployee, getAllEmployee, DeleteEmployee } = require('../controllers/employee.controller');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/add-edit', authenticate, checkAccess('Employees'),
    // authorize([1, 2, 3]),
    upload.single("vimage") , AddEditEmployee);
router.get('/get-all',   authenticate,  getAllEmployee);
router.delete("/:id", authenticate, checkAccess('Employees'),
    // authorize([1, 2, 3]),
    DeleteEmployee );


module.exports = router;
