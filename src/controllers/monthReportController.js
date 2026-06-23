const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET MONTH REPORT (MOBILE APP)
 * =====================================
 */
exports.getMonthReport = async (req, res) => {
  try {
    console.log("➡️ GET MONTH REPORT REQUEST:", req.body);

    const { departmentid, empid, fromDate, toDate } = req.body;

    // ─── VALIDATION ───
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_month_report(
          :vdepartmentid,
          :vfkempid,
          TO_DATE(:vfromDate, 'YYYY-MM-DD'),
          TO_DATE(:vtoDate, 'YYYY-MM-DD'),
          :vretval
        );
      END;
      `,
      {
        vdepartmentid:
          departmentid === null || departmentid === undefined
            ? 0
            : Number(departmentid),

        vfkempid: empid === null || empid === undefined ? 0 : Number(empid),

        vfromDate: fromDate,
        vtoDate: toDate,

        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.vretval;

    const rows = await resultSet.getRows(100000);

    await resultSet.close();

    console.log("row result", rows);

    // ─── FORMAT RESPONSE FOR MOBILE ───
    const formattedRows = rows.map((row) => ({
      firstname: row.FIRSTNAME,
      workingday: row.WORKINGDAY,
      day_type: row.DAY_TYPE,
      remarks: row.REMARKS,
      empid: row.FK_EMPID,
      entrytime: row.ENTRYTIME,
      leaveingtime: row.LEAVEINGTIME,
      attendencedate: row.ATTENDENCEDATE,
      id: row.ID,
      hours: row.HOURS,
      attendance_remarks: row.ATTENDANCE_REMARKS,
      leaveremark: row.LEAVEREMARK,
      reqtype: row.REQTYPE,
      reqstatus: row.REQSTATUS,
      approved: row.APPROVED,
      createdby: row.CREATEDBY,
      editby: row.EDITBY,
      late_remarks: row.LATE_REMARKS,
      datewithday: row.DATEWITHDAY,
      gracetimeperiod: row.GRACETIMEPERIOD,
      totalhours: row.TOTALHOURS,
      work_type: row.WORK_TYPE,
      remote_reason: row.REMOTE_REASON,
      internetname: row.INTERNETNAME,
      timeoutinternetname: row.TIMEOUTINTERNETNAME,
      work_detail: row.WORK_DETAIL,
      email_remarks: row.EMAIL_REMARKS,
      branchname: row.BRANCHNAME,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET MONTH REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch month report",
      error: error.message,
    });
  }
};
