'use strict';

const express = require('express');
// const asyncHandler = require('../../utils/asyncHandler');
// const { validate } = require('../../middleware/validate.middleware');
// const authSchemas = require('../../validators/auth.validator');
// const authController = require('../../controllers/auth.controller');
// const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// router.post('/login/web', validate(authSchemas.login), asyncHandler(authController.loginWeb));
// router.post('/login/app', validate(authSchemas.login), asyncHandler(authController.loginApp));
// router.post('/refresh', validate(authSchemas.refresh), asyncHandler(authController.refresh));
// router.post('/logout', validate(authSchemas.refresh), asyncHandler(authController.logout));
// router.post('/password/forgot', validate(authSchemas.forgotPassword), asyncHandler(authController.forgotPassword));
// router.post('/password/reset', validate(authSchemas.resetPassword), asyncHandler(authController.resetPassword));
// router.post(
//   '/password/me',
//   authenticate(),
//   validate(authSchemas.changeOwnPassword),
//   asyncHandler(authController.changeOwnPassword),
// );

module.exports = router;
