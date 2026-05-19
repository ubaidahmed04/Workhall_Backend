// services/leavetype.service.js

const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditLeaveType(body, actorId) {
  const {
    vleavetypeid,
    vleavetypename,
    vstatus
  } = body;

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        add_edit_leavetype(
          :vleavetypeid,
          :vleavetypename,
          :vstatus,
          :vcreatedby,
          :vmessage
        );
      END;
      `,
      {
        vleavetypeid: vleavetypeid ? Number(vleavetypeid) : null,
        vleavetypename: vleavetypename || null,
        vstatus: vstatus !== undefined ? Number(vstatus) : 0,
        vcreatedby: actorId,
        vmessage: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 500
        }
      },
      { autoCommit: true }
    );
    logger.debug(result);
    return {
      message: result.outBinds.vmessage
    };
  });
}

async function getLeaveTypes() {
  logger.info("Fetching leave types");
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN
        get_leavetype(:retval);
       END;`,
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
      leavetypeid: row.LEAVETYPEID,
      leavetypename: row.LEAVETYPENAME,
      status: row.STATUS
    }));
  });
}

module.exports = {
  addEditLeaveType,
  getLeaveTypes
};