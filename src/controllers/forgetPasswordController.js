const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');
const bcrypt = require("bcrypt");

/**
 * =====================================
 * FORGET PASSWORD API
 * =====================================
 */
exports.forgetPassword = async (req, res) => {
  try {
    console.log(" FORGET PASSWORD REQUEST:", req.body);

    const { userid, password } = req.body;

    if (!userid || !password) {
      return res.status(400).json({
        success: false,
        message: "userid and password are required",
      });
    }

    /**
     *  HASH PASSWORD
     * Same approach used by login controller
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(" HASHED PASSWORD:", hashedPassword);

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        Forget_Pass(
          :vuserid,
          :vpassword,
          :vmsg
        );
      END;
      `,
      {
        vuserid: Number(userid),

        // Save hash instead of plain password
        vpassword: hashedPassword,

        vmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500,
        },
      },
      {
        autoCommit: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: result.outBinds.vmsg,
    });

      });
  } catch (error) {
    console.error(" FORGET PASSWORD ERROR:", error);

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
      message: "Password update failed",
      error: error.message,
      oracleCode: error.code,
    });
  }
};
