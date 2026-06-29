const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * VERIFY OTP API
 * =====================================
 */
exports.verifyOtp = async (req, res) => {
  try {
    console.log(" VERIFY OTP REQUEST:", req.body);

    const { userid, otp } = req.body;

    if (!userid || !otp) {
      return res.status(400).json({
        success: false,
        message: "userid and otp are required",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        OTP_verification(
          :votp,
          :vfk_userid,
          :vmsg
        );
      END;
      `,
      {
        votp: otp,
        vfk_userid: Number(userid),

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

    const message = result.outBinds.vmsg;

    return res.status(200).json({
      success: message === "OTP Verified",
      message,
    });

      });
  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};
