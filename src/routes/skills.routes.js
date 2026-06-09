'use strict';

const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const { AddEditSkill, getAllSkills } = require('../controllers/skills.controller');

const router = express.Router();

router.post('/add-edit', authenticate,
    // authorize([1, 2, 3]),
    AddEditSkill);
router.get('/get-all',   authenticate, getAllSkills);



module.exports = router;
