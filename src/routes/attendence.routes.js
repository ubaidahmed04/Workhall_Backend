'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { AddEditAttendance, getAllAttendance, getAttendanceByDate, deleteAttendance } = require('../controllers/attendence.controller');
const authorize = require('../middleware/authorize.middleware');

router.get('/get-all',        
  // authenticate,
   getAllAttendance);
router.get('/by-date',        
  // authenticate,
   getAttendanceByDate);   // ?date=2025-01-20&empid=5
router.post('/add-edit',      
  // authenticate,
   AddEditAttendance);
router.delete('/:id',         
  // authenticate,
   deleteAttendance)

module.exports = router;