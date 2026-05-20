'use strict';

const oracledb = require('oracledb');
const { withConnection } = require('../database/oraclePool');

const parseDate = (val) => val ? new Date(val) : new Date('0001-01-01T00:00:00');
const toNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};
async function saveAttendance(body, actorId, username) {
  return withConnection(async (conn) => {
    const {
      fk_empid, entrytime, leaveingtime, attendencedate,
      fk_branchid, work_type, remote_reason, remark, worksheet,
    } = body;

    const result = await conn.execute(
      `BEGIN
        add_edit_attendence_web(
          :vfk_empid, :ventrytime, :vleaveingtime, :vattendencedate,
          :vfk_userid, :vfk_branchid, :vwork_type, :vremote_reason,
          :vremark, :vworksheet, :vcreatedby, :vmessage
        );
      END;`,
       {
        vfk_empid:       { val: toNumber(fk_empid), type: oracledb.NUMBER },
        ventrytime:      { val: parseDate(entrytime), type: oracledb.DATE },
        vleaveingtime:   { val: parseDate(leaveingtime), type: oracledb.DATE },
        vattendencedate: { val: parseDate(attendencedate), type: oracledb.DATE },

        vfk_userid:      { val: toNumber(actorId), type: oracledb.NUMBER },
        vfk_branchid:    { val: toNumber(fk_branchid), type: oracledb.NUMBER },

        vwork_type:      { val: work_type || null, type: oracledb.STRING },
        vremote_reason:  { val: remote_reason || null, type: oracledb.STRING },
        vremark:         { val: remark || null, type: oracledb.STRING },
        vworksheet:      { val: worksheet || null, type: oracledb.STRING },

        vcreatedby:      { val: username, type: oracledb.STRING },

        vmessage:        { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      {
        autoCommit: true
      }
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
      { retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } },
    );

    const cursor = result.outBinds.retval;
    const rows = await cursor.getRows();
    await cursor.close();

    // Map column names to lowercase friendly keys
    return rows?.map((r) => ({
      attendid:      r.ATTENDID,
      fk_empid:      r.FK_EMPID,
      firstname:     r.FIRSTNAME,
      lastname:      r.LASTNAME,
      entrytime:     r.ENTRYTIME,
      leaveingtime:  r.LEAVEINGTIME,
      hours:         r.HOURS,
      attendencedate:r.ATTENDENCEDATE,
      remarks:       r.REMARKS,
      work_type:     r.WORK_TYPE,
      remote_reason: r.REMOTE_REASON,
      status:        r.STATUS,
    }));
  });
}

async function fetchAttendanceByDate(date, empid) {
    console.log(date, empid)
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN get_attendence_by_date(:vdate, :vempid, :retval); END;`,
      {
        vdate: new Date(date),
        vempid: empid || null,
        retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const cursor = result.outBinds.retval;
    const rows = await cursor.getRows();
    await cursor.close();

    return  rows?.map((r) => ({
      attendid:      r.ATTENDID,
      fk_empid:      r.FK_EMPID,
      firstname:     r.FIRSTNAME,
      lastname:      r.LASTNAME,
      entrytime:     r.ENTRYTIME,
      leaveingtime:  r.LEAVEINGTIME,
      hours:         r.HOURS,
      attendencedate:r.ATTENDENCEDATE,
      remarks:       r.REMARKS,
      work_type:     r.WORK_TYPE,
      remote_reason: r.REMOTE_REASON,
      fk_branchid:   r.BRANCHID,
      branchname:    r.BRANCHNAME,
      status:        r.STATUS,
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

module.exports = { saveAttendance, fetchAllAttendance, fetchAttendanceByDate, softDeleteAttendance };