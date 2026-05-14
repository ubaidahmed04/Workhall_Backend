'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditSkill, getAllSkills } = require('../controllers/skills.controller');

const router = express.Router();

router.post('/add-edit', optionalAuth , AddEditSkill);
router.get('/get-all', optionalAuth , getAllSkills);



module.exports = router;
