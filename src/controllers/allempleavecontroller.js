const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET ALL EMPLOYEE LEAVES
 * =====================================
 */
exports.getAllEmployeeLeaves = async (req, res) => {
  try {
    console.log("➡️ GET ALL EMPLOYEE LEAVES REQUEST");

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_empleave(
          :retval
        );
      END;
      `,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.retval;

    const rows = await resultSet.getRows(100000);

    await resultSet.close();

    const formattedRows = rows.map((row) => ({
      empleaveid: row.EMPLEAVEID,
      empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      leavetypeid: row.FK_LEAVETYPEID,
      leavetypename: row.LEAVETYPENAME,
      fromdate: row.FROMDATE,
      todate: row.TODATE,
      description: row.DESCRIPTION,
      approvalid: row.FK_APPROVALID,
      approvalstatusname: row.APPROVALSTATUSNAME,
      status: row.STATUS,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET ALL EMPLOYEE LEAVES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee leaves",
      error: error.message,
    });
  }
};
