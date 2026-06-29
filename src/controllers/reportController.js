const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * MONTH REPORT API
 * =====================================
 */
exports.getMonthReport = async (req, res) => {
  try {
    console.log(" MONTH REPORT REQUEST:", req.body);

    const { departmentid, fkempid, fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    await withConnection(async (conn) => {

    console.log(" Oracle connection acquired");

    const result = await conn.execute(
      `
      BEGIN
        get_month_report(
          :vdepartmentid,
          :vfkempid,
          TO_DATE(:vfromDate, 'YYYY-MM-DD'),
          TO_DATE(:vtoDate, 'YYYY-MM-DD'),
          :retval
        );
      END;
      `,
      {
        vdepartmentid: Number(departmentid || 0),
        vfkempid: Number(fkempid || 0),

        vfromDate: fromDate,
        vtoDate: toDate,

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

    console.log(` Total Records: ${rows.length}`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });

      });
  } catch (error) {
    console.error("❌ MONTH REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch month report",
      error: error.message,
    });
  }
};
