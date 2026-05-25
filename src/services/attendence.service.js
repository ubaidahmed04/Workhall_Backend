'use strict';

const oracledb = require('oracledb');
const { withConnection } = require('../database/oraclePool');

const parseDate = (val) => {
  if (!val) return null;

  const d = new Date(val);

  return isNaN(d.getTime()) ? null : d;
};
const toNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

async function saveAttendance(body, actorId, username) {
  return withConnection(async (conn) => {
    const {
      fk_empid, entrytime, leaveingtime, attendencedate,
      fk_branchid, work_type, remote_reason, remark, worksheet, attendid
    } = body;

    const result = await conn.execute(
      `BEGIN
        add_edit_attendence_web(
          :vfk_empid, :ventrytime, :vleaveingtime, :vattendencedate,
          :vfk_attendid, :vfk_branchid, :vwork_type, :vremote_reason,
          :vremark, :vworksheet, :vcreatedby, :vmessage
        );
      END;`,
      {
        vfk_empid: { val: toNumber(fk_empid), type: oracledb.NUMBER },
        ventrytime: { val: parseDate(entrytime), type: oracledb.DATE },
        vleaveingtime: { val: parseDate(leaveingtime), type: oracledb.DATE },
        vattendencedate: { val: parseDate(attendencedate), type: oracledb.DATE },
        vfk_attendid: { val: toNumber(attendid), type: oracledb.NUMBER },
        vfk_branchid: { val: toNumber(fk_branchid), type: oracledb.NUMBER },
        vwork_type: { val: work_type || null, type: oracledb.STRING },
        vremote_reason: { val: remote_reason || null, type: oracledb.STRING },
        vremark: { val: remark || null, type: oracledb.STRING },
        vworksheet: { val: worksheet || null, type: oracledb.STRING },
        vcreatedby: { val: username, type: oracledb.STRING },
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true }
    );

    const message = result.outBinds.vmessage;
    if (!message || message === 'Error In Execution')
      return { status: false, message: 'Procedure execution failed' };

    return { status: true, message };
  });
}

async function fetchAllAttendance() {
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN get_attendence_today(:retval); END;`,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const cursor = result.outBinds.retval;

    const rows = await cursor.getRows(1000);

    await cursor.close();
    // return rows
    return rows.map((r, i) => ({
      uniqueId: r.ATTENDID != null ? String(r.ATTENDID) : `emp-${r.EMPID}-${i}`,
      empid: r.EMPID,
      attendid: r.ATTENDID,
      name: r.NAME,
      leaveRemark: r.DESCRIPTION,
      leavetypename: r.LEAVETYPENAME,
      entrytime: r.ENTRYTIME,
      leaveingtime: r.LEAVEINGTIME,
      depname: r.DEPNAME,
      officetime: r.TIMEIN,
      branchid: r.BRANCHID,
      branchname: r.BRANCHNAME,
      attendance_status: r.ATTENDANCE_STATUS,
      last_present: r.LAST_PRESENT,
      attendencedate: r.DATES,
      workdetail: r.WORKDETAIL,
      work_type: r.WORK_TYPE,
      remote_reason: r.REMOTE_REASON,

    }));
  });
}

async function fetchAttendanceByDate(fromdate, todate) {
  return withConnection(async (connection) => { 

  const result = await connection.execute(
    `BEGIN
       get_attendence_bydate(
         TO_DATE(:vfromdate, 'YYYY-MM-DD'),
         TO_DATE(:vtodate, 'YYYY-MM-DD'),
         :retval
       );
     END;`,
    {
      vfromdate: fromdate,
      vtodate: todate,
      retval: {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR,
      },
    }
  );

  const rows = await result.outBinds.retval.getRows(1000);

  await result.outBinds.retval.close();
  await connection.close();

  return rows.map((r,i) => ({
    uniqueId: r.ATTENDID != null ? String(r.ATTENDID) : `emp-${r.EMPID}-${i}`,
    empid: r.EMPID,
    attendid: r.ATTENDID,
    name: r.NAME,
    leaveRemark: r.DESCRIPTION,
    leavetypename: r.LEAVETYPENAME,
    entrytime: r.ENTRYTIME,
    leaveingtime: r.LEAVEINGTIME,
    depname: r.DEPNAME,
    officetime: r.TIMEIN,
    branchid: r.FK_BRANCHID,
    branchname: r.BRANCHNAME,
    attendance_status: r.ATTENDANCE_STATUS,
    last_present: r.LAST_PRESENT,
    attendencedate: r.DATES,
    workdetail: r.WORKDETAIL,
    work_type: r.WORK_TYPE,
    remote_reason: r.REMOTE_REASON,

  }));
  });
}

async function getDeptAttSummary() {

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN get_attendence_dep_summary(:retval); END;`,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const cursor = result.outBinds.retval;

    const rows = await cursor.getRows(1000);

    await cursor.close();

    return rows.map((r) => ({
      depid: r.DEPID,
      depname: r.DEPNAME,
      total_employees: r.TOTAL_EMPLOYEES,
      present_employees: r.PRESENT_EMPLOYEES,
      absent_employees: r.ABSENT_EMPLOYEES,
    }));
  });
}
async function softDeleteAttendance(attendid, actorId) {
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN delete_attendence(:vattendid, :veditby, :vmessage); END;`,
      {
        vattendid: Number(attendid),
        veditby: `${actorId} | DELETED`,
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true }
    );

    return {
      status: true,
      message: result.outBinds.vmessage
    };
  });
}



module.exports = { saveAttendance, fetchAllAttendance, fetchAttendanceByDate, softDeleteAttendance, getDeptAttSummary };


