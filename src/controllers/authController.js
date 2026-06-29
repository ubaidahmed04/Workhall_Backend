const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    console.log(" LOGIN REQUEST BODY:", req.body);

    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    await withConnection(async (conn) => {

    console.log(" Oracle connection acquired");

    // 1. Get user data from login_app_data
    const result = await conn.execute(
      `
      BEGIN
          login_app_data(
              :vusername,
              :vmsg,
              :vretval
          );
      END;
      `,
      {
        vusername: username,

        vmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500,
        },

        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const message = result.outBinds.vmsg;

    console.log(" OUT MESSAGE:", message);

    // If login_app_data indicates an error (except "Already Log in"), return early
    if (message !== "Success" && message !== "This User is Already Log in") {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    const resultSet = result.outBinds.vretval;

    const rows = await resultSet.getRows(100);

    await resultSet.close();

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User record not found",
      });
    }

    console.log(" USER DATA:", rows);

    const user = rows[0];

    /**
     * Extract password hash from user row
     * Tries multiple possible column names
     */
    const dbPass =
      user.PASSWORD ||
      user.password ||
      user.USERPASSWORD ||
      user.userpassword ||
      Object.values(user)[5];

    console.log(" HASH PASSWORD:", dbPass);

    const isMatch = await bcrypt.compare(password, dbPass);

    console.log(" PASSWORD MATCH:", isMatch);

    // 2. Determine vcorrect based on password match
    const vcorrect = isMatch ? 1 : 0;

    // 3. Extract userid and roleid from user row
    // Try multiple possible column names
    const userid = user.USERID || user.userid || user.ID || user.id || null;

    const roleid =
      user.ROLEID ||
      user.roleid ||
      user.FK_ROLEID ||
      user.fk_roleid ||
      user.ROLE_ID ||
      user.role_id ||
      null;

    // 4. Call login_app_verify to update login status and get final message
    const verifyResult = await conn.execute(
      `
      BEGIN
          login_app_verify(
              :vuserid,
              :vroleid,
              :vcorrect,
              :vmsg
          );
      END;
      `,
      {
        vuserid: {
          val: userid || 0, // fallback to 0 if not found
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
        },
        vroleid: {
          val: roleid || 0,
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
        },
        vcorrect: {
          val: vcorrect,
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
        },
        vmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500,
        },
      },
    );

    const verifyMessage = verifyResult.outBinds.vmsg;
    console.log(" VERIFY MESSAGE:", verifyMessage);

    // 5. Prepare response
    if (isMatch) {
      return res.status(200).json({
        success: true,
        message: verifyMessage || "Login Successful", // fallback
        data: user,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: verifyMessage || "Invalid Credentials",
        data: [],
      });
    }

      });
  } catch (error) {
    console.error(" LOGIN ERROR");
    console.error(error);

    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENOTFOUND" ||
      (error.message && error.message.includes("ORA-12170")) ||
      (error.message && error.message.includes("ORA-12541")) ||
      (error.message && error.message.includes("ORA-12514"));

    if (isNetworkError) {
      return res.status(503).json({
        success: false,
        message: "Network connection failed please check your internet",
        error: error.message,
        oracleCode: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message,
      oracleCode: error.code,
    });
  }
};
