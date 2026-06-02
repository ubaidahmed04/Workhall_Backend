const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");


async function getMonthReport({
  departmentId = 0,
  empId = 0,
  fromDate,
  toDate,
}) {
  logger.info("Fetching attendance month report");

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `
      BEGIN
        get_month_report(
          :vdepartmentid,
          :vfkempid,
          :vfromDate,
          :vtoDate,
          :retval
        );
      END;
      `,
      {
        vdepartmentid: Number(departmentId),
        vfkempid: Number(empId),
        vfromDate: new Date(fromDate),
        vtoDate: new Date(toDate),

        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      }
    );

    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows(); // fetch all rows
    await resultSet.close();

    return rows?.map((row) => ({
      firstname: row.FIRSTNAME,
      workingday: row.WORKINGDAY,
      dayType: row.DAY_TYPE,
      remarks: row.REMARKS,
      empId: row.FK_EMPID,
      entryTime: row.ENTRYTIME,
      leavingTime: row.LEAVEINGTIME,
      attendanceDate: row.ATTENDENCEDATE,
      attendId: row.ID,
      hours: row.HOURS,
      attendanceRemarks: row.ATTENDANCE_REMARKS,
      leaveRemark: row.LEAVEREMARK,
      approved: row.APPROVED,
      lateRemarks: row.LATE_REMARKS,
      dateWithDay: row.DATEWITHDAY,
      graceTimePeriod: row.GRACETIMEPERIOD,
      totalHours: row.TOTALHOURS,
      workType: row.WORK_TYPE,
      remoteReason: row.REMOTE_REASON,
      internetName: row.INTERNETNAME,
      timeoutInternetName: row.TIMEOUTINTERNETNAME,
      workDetail: row.WORK_DETAIL,
      emailRemarks: row.EMAIL_REMARKS,
    }));
  });
}

module.exports = {
  getMonthReport,
};