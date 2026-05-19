const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

async function addEditEmpLeave(body, actorId) {

  const toNumberOrNull = (v) =>
    v === "" || v === undefined || v === null
      ? null
      : Number(v);

  const {
    vempleaveid,
    vfk_empid,
    vfk_leavetypeid,
    vfromdate,
    vtodate,
    vdescrip,
    vstatus
  } = body;

  return withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        add_edit_empleave(
          :vempleaveid,
          :vfk_empid,
          :vfk_leavetypeid,
          :vfromdate,
          :vtodate,
          :vdescrip,
          :vstatus,
          :vcreatedby,
          :vmessage
        );
      END;
      `,
      {
        vempleaveid: toNumberOrNull(vempleaveid),
        vfk_empid: toNumberOrNull(vfk_empid),
        vfk_leavetypeid: toNumberOrNull(vfk_leavetypeid),
        vfromdate: vfromdate ? new Date(vfromdate) : null,
        vtodate: vtodate ? new Date(vtodate) : null,
        vdescrip: vdescrip || null,
        vstatus:  vstatus !== undefined ? Number(vstatus) : 0,
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
    return { message: result.outBinds.vmessage }
  });
}

async function getEmpLeaves() {

  logger.info("Fetching employee leaves");

  return withConnection(async (conn) => {

    const result = await conn.execute(`
      BEGIN
        get_empleave(:retval);
      END;
      `,{
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }});
    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows();
    await resultSet.close();

    return rows?.map((row) => ({
      empleaveid: row.EMPLEAVEID,
      fk_empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      fk_leavetypeid: row.FK_LEAVETYPEID,
      leavetypename: row.LEAVETYPENAME,
      fromdate: row.FROMDATE,
      todate: row.TODATE,
      description: row.DESCRIPTION,
      status: row.STATUS
    }));
  });
}

module.exports = {
  addEditEmpLeave,
  getEmpLeaves
};