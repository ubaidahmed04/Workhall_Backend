const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET LEAVE TYPE API
 * =====================================
 */
exports.getLeaveType = async (req, res) => {
  try {
    console.log(" GET LEAVE TYPE REQUEST");

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_leavetype(:vretval);
      END;
      `,
      {
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

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });

      });
  } catch (error) {
    console.error("❌ GET LEAVE TYPE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leave types",
      error: error.message,
    });
  }
};
