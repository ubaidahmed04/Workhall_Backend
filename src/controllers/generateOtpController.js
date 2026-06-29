const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GENERATE OTP API
 * =====================================
 */
exports.generateOtp = async (req, res) => {
  try {
    console.log(" GENERATE OTP REQUEST:", req.body);

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
        OTP_generate(
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

    return res.status(200).json({
      success: true,
      message: result.outBinds.vmsg,
      otp: otp,
      userid: Number(userid),
    });

      });
  } catch (error) {
    console.error(" GENERATE OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "OTP generation failed",
      error: error.message,
    });
  }
};
