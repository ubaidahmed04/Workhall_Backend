'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance, getDeptAttendanceSummary } = require('../controllers/attendence.controller');
const authorize = require('../middleware/authorize.middleware');

router.get('/get-all',    authenticate, getAllAttendance);
router.get('/by-date',        
  // authenticate,
   getAttendanceByDate);   // ?date=2025-01-20&empid=5
router.post('/add-edit',  authenticate, authorize([1, 2, 3]),   AddEditAttendance);

router.get("/dept-attendance-summary",   authenticate, getDeptAttendanceSummary );
router.delete('/:id',     authenticate, deleteAttendance)

module.exports = router;