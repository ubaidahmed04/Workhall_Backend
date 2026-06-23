const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');
const { sendOtpEmail } = require("../services/mailService");

exports.sendOtp = async (req, res) => {
  try {
    const { userid, email } = req.body;

    if (!userid || !email) {
      return res.status(400).json({
        success: false,
        message: "userid and email are required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

    const mailSent = await sendOtpEmail(email, otp);

    if (!mailSent) {
      return res.status(500).json({
        success: false,
        message: "OTP generated but email failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: result.outBinds.vmsg,
    });

      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
