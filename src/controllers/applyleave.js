const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * APPLY / EDIT LEAVE API
 * =====================================
 */
exports.applyLeave = async (req, res) => {
  try {
    console.log(" APPLY LEAVE REQUEST:", req.body);

    const {
      empleaveid,
      empid,
      leavetypeid,
      fromdate,
      todate,
      description,
      approvalid,
      status,
      createdby,
    } = req.body;

    // basic validation
    if (!empid || !leavetypeid || !fromdate || !todate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        add_edit_empleave(
          :vempleaveid,
          :vfk_empid,
          :vfk_leavetypeid,
          TO_DATE(:vfromdate, 'YYYY-MM-DD'),
          TO_DATE(:vtodate, 'YYYY-MM-DD'),
          :vdescrip,
          :vfk_approvalid,
          :vstatus,
          :vcreatedby,
          :vmessage
        );
      END;
      `,
      {
        vempleaveid: empleaveid ? Number(empleaveid) : null,
        vfk_empid: Number(empid),
        vfk_leavetypeid: Number(leavetypeid),
        vfromdate: fromdate,
        vtodate: todate,
        vdescrip: description || null,
        vfk_approvalid: approvalid ? Number(approvalid) : null,
        vstatus: status ? Number(status) : 0,
        vcreatedby: createdby || "mobile_app",

        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
        },
      },
      {
        autoCommit: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: result.outBinds.vmessage,
    });

      });
  } catch (error) {
    console.error(" APPLY LEAVE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Leave submission failed",
      error: error.message,
    });
  }
};
