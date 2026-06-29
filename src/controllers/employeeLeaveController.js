const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET EMPLOYEE LEAVE (MOBILE) API
 * =====================================
 */
exports.getEmployeeLeaveMobile = async (req, res) => {
  try {
    console.log(" GET EMPLOYEE LEAVE MOBILE REQUEST:", req.body);

    const { empid } = req.body;

    if (!empid) {
      return res.status(400).json({
        success: false,
        message: "empid is required",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_empleave_app(
          :vempid,
          :vretval
        );
      END;
      `,
      {
        vempid: Number(empid),
        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const resultSet = result.outBinds.vretval;
    const rows = await resultSet.getRows(100000);
    await resultSet.close();

    // Optional: normalize response for mobile UI
    const formattedRows = rows.map((item) => ({
      empleaveid: item.EMPLEAVEID,
      empid: item.FK_EMPID,
      firstname: item.FIRSTNAME,
      lastname: item.LASTNAME,
      leavetypeid: item.FK_LEAVETYPEID,
      leavetypename: item.LEAVETYPENAME,
      fromdate: item.FROMDATE,
      todate: item.TODATE,
      description: item.DESCRIPTION,
      approvalid: item.FK_APPROVALID,
      approvalstatusname: item.APPROVALSTATUSNAME,
      status: item.STATUS,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error(" GET EMPLOYEE LEAVE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee leaves",
      error: error.message,
    });
  }
};
