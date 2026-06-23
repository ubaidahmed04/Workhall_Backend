const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET ATTENDANCE TODAY (MOBILE APP)
 * =====================================
 */
exports.getAttendanceToday = async (req, res) => {
  try {
    console.log("➡️ GET ATTENDANCE TODAY REQUEST");

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_attendence_today(:retval);
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

    // ─── FORMAT RESPONSE ───
    const formattedRows = rows.map((row) => ({
      empid: row.EMPID,
      name: row.NAME,
      attendid: row.ATTENDID,
      leavetypename: row.LEAVETYPENAME,
      description: row.DESCRIPTION,
      branchid: row.BRANCHID,
      branchname: row.BRANCHNAME,
      work_type: row.WORK_TYPE,
      remote_reason: row.REMOTE_REASON,
      date: row.DATES,
      entrytime: row.ENTRYTIME,
      leaveingtime: row.LEAVEINGTIME,
      department: row.DEPNAME,
      shift_timein: row.TIMEIN,
      shift_gracetime: row.GRACETIME,
      attendance_status: row.ATTENDANCE_STATUS,
      last_present: row.LAST_PRESENT,
      dailyworkid: row.DAILYWORKID,
      workdetail: row.WORKDETAIL,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET ATTENDANCE TODAY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance today",
      error: error.message,
    });
  }
};
