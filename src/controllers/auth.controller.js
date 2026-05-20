const jwt = require("jsonwebtoken");
const logger = require("../config/logger.js");
const { loginWeb } = require("../services/auth.service.js");
const { signAccessToken } = require("../utils/jwt.util.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
console.log("JWT_SECRET:", JWT_SECRET);
async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await loginWeb(username.trim(), password);

    const tokenPayload = {
      userid: user.userid,
      empid: user.empid,
      username: user.username,
      roleid: user.roleid,
    };

     const token = signAccessToken(tokenPayload);
     res.cookie("accessToken", token, {
      httpOnly: true,       // JS se access nahi hoga (XSS safe)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",   // CSRF protection
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        userid: user.userid,
        empid: user.empid,
        username: user.username,
        roleid: user.roleid,
        rolename: user.rolename,
      },
    });

  } catch (err) {
    logger.error({ event: "login_failed", error: err.message });

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    return res.status(status).json({ message });
  }
}
function logout(req, res) {
  res.clearCookie("accessToken", {  // "token" nahi, "accessToken"
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully"
  });
}
module.exports = {
  loginController,
  logout

};