'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance, getDeptAttendanceSummary } = require('../controllers/attendence.controller');
const authorize = require('../middleware/authorize.middleware');
const checkAccess = require('../middleware/checkAccess.middleware');

router.get('/get-all',   authenticate, getAllAttendance);
router.get('/by-date',   authenticate, getAttendanceByDate);  
router.post('/add-edit',  authenticate, checkAccess('Attendance'),
    // authorize([1, 2, 3]),
   AddEditAttendance);

router.get("/dept-attendance-summary",   authenticate, getDeptAttendanceSummary );
router.delete('/:id',     authenticate,  checkAccess('Attendance'),
   // authorize([1, 2, 3]), 
   deleteAttendance)

module.exports = router;