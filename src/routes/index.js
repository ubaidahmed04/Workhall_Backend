'use strict';

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const departRoutes = require('./department.routes.js');
const designationRoutes = require('./designation.routes.js');
const { health } = require('../controllers/health.controller.js');
const roleRoutes = require('./roles.routes.js');
const qualificationRoutes = require('./qualification.routes.js');
const skillsRoutes = require('./skills.routes.js');
const holidayRoutes = require('./holiday.routes.js');
const employeeRoutes = require('./employee.routes.js');
const clientRoutes = require('./client.routes.js');
const leaveTypeRoutes = require('./leaveType.routes.js');
const leaveRoutes = require('./leave.routes.js');
const employeeLeaveRoutes = require('./empLeave.routes.js');
const branchRoutes = require('./branch.routes.js');
const attendenceRoutes = require('./attendence.routes.js');
const dailyWorkSheetRoutes = require('./dailyWorksheet.routes.js');

const router = express.Router();

router.get('/health', asyncHandler(health));
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/department', departRoutes);
router.use('/designation', designationRoutes);
router.use('/roles', roleRoutes);
router.use('/qualification', qualificationRoutes);
router.use('/skills', skillsRoutes);
router.use('/holiday', holidayRoutes);
router.use('/client', clientRoutes);
router.use('/employee', employeeRoutes);
router.use('/leavetype', leaveTypeRoutes);
router.use('/leave', leaveRoutes);
router.use('/employeeLeave', employeeLeaveRoutes);
router.use('/branch', branchRoutes);
router.use('/attendance', attendenceRoutes);
router.use('/worksheet', dailyWorkSheetRoutes);
// router.use('/', roleRoutes);

module.exports = router;
