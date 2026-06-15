'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');
const { addEditDesignation,getAllDesignation } = require('../controllers/designation.controller');
const { getAllProject } = require('../controllers/project.controller');
const { getAllTaskStatus, getAllPriority, AddEditTask, GetAllTask } = require('../controllers/task.controller');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/add-edit', authenticate, upload.single('vtaskdoc'), checkAccess('Task'),
    // authorize([1, 2, 3]),
    AddEditTask);
router.get('/getProject',    authenticate,   getAllProject);
router.get('/getTaskStatus', authenticate,   getAllTaskStatus);
router.get('/getPriority',   authenticate,   getAllPriority);
router.get('/get-all',       authenticate,   GetAllTask);



module.exports = router;
