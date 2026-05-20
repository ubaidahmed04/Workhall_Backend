const { Router } = require("express");
const { loginController, logout } = require("../controllers/auth.controller.js");

const router = Router();

router.post("/login",
  // loginValidator, validate,
  loginController
);
router.post("/logout", logout)
module.exports = router;