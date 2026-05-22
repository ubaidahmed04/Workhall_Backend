const { Router } = require("express");
const { loginController, logout } = require("../controllers/auth.controller.js");

const router = Router();

router.post("/login",  loginController );
router.post("/logout", logout)
module.exports = router;