const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"NutrackX Support" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "Password Reset OTP",

      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../../assets/task_images/logo.png"),
          cid: "companylogo",
        },
      ],

      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f4f7fb;
          font-family:Arial, Helvetica, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding:30px 15px;"
        >
          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#ffffff;
                  border-radius:16px;
                  overflow:hidden;
                  box-shadow:0 4px 18px rgba(0,0,0,0.08);
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background:#0f172a;
                      padding:35px 20px;
                    "
                  >
                    <img
                      src="cid:companylogo"
                      alt="Logo"
                      width="120"
                      style="
                        display:block;
                        margin-bottom:15px;
                      "
                    />

                    <h1
                      style="
                        color:#ffffff;
                        margin:0;
                        font-size:24px;
                        font-weight:bold;
                      "
                    >
                      Password Reset Request
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 35px;">
                    <p
                      style="
                        color:#374151;
                        font-size:16px;
                        margin:0 0 15px;
                      "
                    >
                      Hello,
                    </p>

                    <p
                      style="
                        color:#374151;
                        font-size:15px;
                        line-height:24px;
                      "
                    >
                      We received a request to reset your password.
                      Please use the verification code below to continue.
                    </p>

                    <div
                      style="
                        text-align:center;
                        margin:35px 0;
                      "
                    >
                      <div
                        style="
                          display:inline-block;
                          background:#eff6ff;
                          border:2px dashed #2563eb;
                          color:#2563eb;
                          font-size:34px;
                          font-weight:bold;
                          letter-spacing:8px;
                          padding:18px 35px;
                          border-radius:12px;
                        "
                      >
                        ${otp}
                      </div>
                    </div>

                    <p
                      style="
                        color:#6b7280;
                        font-size:14px;
                        line-height:22px;
                      "
                    >
                      This OTP will expire shortly.
                    </p>

                    <p
                      style="
                        color:#dc2626;
                        font-size:14px;
                        line-height:22px;
                        font-weight:bold;
                      "
                    >
                      Do not share this OTP with anyone.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background:#f8fafc;
                      padding:20px;
                      text-align:center;
                      border-top:1px solid #e5e7eb;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        color:#6b7280;
                        font-size:13px;
                      "
                    >
                      © ${new Date().getFullYear()} NutrackX
                    </p>

                    <p
                      style="
                        margin-top:8px;
                        color:#9ca3af;
                        font-size:12px;
                      "
                    >
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    return true;
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
};
