const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET DEPARTMENTS
 * =====================================
 */
exports.getDepartments = async (req, res) => {
  try {
    console.log(" GET DEPARTMENTS REQUEST");

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_department(
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
      depid: row.DEPID,
      depname: row.DEPNAME,
      taskaccess: row.TASKACCESS,
      status: row.STATUS,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error(" GET DEPARTMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};
