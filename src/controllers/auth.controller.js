// controllers/auth.controller.js

const logger = require("../config/logger.js");
const { loginWeb } = require("../services/auth.service.js");
const { signAccessToken } = require("../utils/jwt.util.js");

const isProduction = process.env.NODE_ENV === "production";

// Cookie config — cross-origin ke liye SameSite=None + Secure=true zaroori hai
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,               // production mein HTTPS only
  sameSite: isProduction ? "none" : "lax", // cross-origin ke liye "none"
  maxAge: 8 * 60 * 60 * 1000,        // 8 hours in ms
  path: "/",
};

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.fail(400, "Username and password are required");
    }

    const user = await loginWeb(username.trim(), password);

    const tokenPayload = {
      userid: user.userid,
      empid: user.empid,
      username: user.username,
      roleid: user.roleid,
    };

    const token = signAccessToken(tokenPayload);

    res.cookie("accessToken", token, COOKIE_OPTIONS);

    return res.success({
      user: {
        userid: user.userid,
        empid: user.empid,
        username: user.username,
        roleid: user.roleid,
        rolename: user.rolename,
      },
    }, "Login successful");
  } catch (err) {
    logger.error({ event: "login_failed", error: err.message });
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    return res.fail(status, message);
  }
}

function logout(req, res) {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  return res.success({}, "Logged out successfully");
}

module.exports = { loginController, logout };
