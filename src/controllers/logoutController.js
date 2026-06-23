const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * LOGOUT APP USER
 * =====================================
 */
exports.logoutApp = async (req, res) => {
  try {
    console.log("➡️ LOGOUT REQUEST:", req.body);

    const { userid } = req.body;

    if (userid === undefined || userid === null || userid === "") {
      return res.status(400).json({
        success: false,
        message: "userid is required",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        logout_app(
          :vuserid,
          :vmsg
        );
      END;
      `,
      {
        vuserid: Number(userid),

        vmsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: result.outBinds.vmsg,
    });

      });
  } catch (error) {
    console.error("❌ LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
