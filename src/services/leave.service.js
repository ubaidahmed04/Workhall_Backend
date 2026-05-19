// services/leave.service.js

const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditLeave(body, actorId) {

  const toNumberOrNull = (v) =>
    v === "" || v === undefined || v === null
      ? null
      : Number(v);

  const {
    vleaveid,
    fk_departmentid,
    fk_leavetypeid,
    fromdate,
    todate,
    leave,
    vstatus
  } = body;

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        add_edit_leave(
          :vleaveid,
          :vfk_departid,
          :vfk_leavetypeid,
          :vfromdate,
          :vtodate,
          :vleaves,
          :vstatus,
          :vcreatedby,
          :vmessage
        );
      END;
      `,
      {
        vleaveid: toNumberOrNull(vleaveid),
        vfk_departid: toNumberOrNull(fk_departmentid),
        vfk_leavetypeid: toNumberOrNull(fk_leavetypeid),
        vfromdate: fromdate ? new Date(fromdate) : null,
        vtodate: todate ? new Date(todate) : null,
        vleaves: toNumberOrNull(leave),
        vstatus: vstatus !== undefined ? Number(vstatus) : 0,
        vcreatedby: actorId,
        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500
        }
      },
      {
        autoCommit: true
      }
    );
    logger.debug(result);
    return {
      message: result.outBinds.vmessage
    };
  });
}


async function getLeaves() {

  logger.info("Fetching leaves");
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_leave(:retval);
      END;
      `,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      }
    );
    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows(); // fetch all rows

    await resultSet.close();

    return rows?.map((row) => ({
      leaveid: row.LEAVEID,
      fk_departmentid: row.FK_DEPARTMENTID,
      depname: row.DEPNAME,
      fk_leavetypeid: row.FK_LEAVETYPEID,
      leavetypename: row.LEAVETYPENAME,
      fromdate: row.FROMDATE,
      todate: row.TODATE,
      leave: row.LEAVE,
      status: row.STATUS,
      createdby: row.CREATEDBY,
      editby: row.EDITBY
    }));
  });
}

module.exports = {
  addEditLeave,
  getLeaves
};