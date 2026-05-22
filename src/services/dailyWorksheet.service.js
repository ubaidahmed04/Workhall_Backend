// services/dailyWorksheet.service.js

const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");

async function getDailyWorksheet() {
  return withConnection(async (conn) => {

    const result = await conn.execute(
      `BEGIN
          get_dailyworksheet(:retval);
       END;`,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      }
    );

    const rs = result.outBinds.retval;
    const rows = await rs.getRows(); // all rows
    await rs.close();

    return rows.map((r) => ({
      dailyworkid: r.DAILYWORKID,
      fk_empid: r.FK_EMPID,
      workdetail: r.WORKDETAIL,
      workdate: r.WORKDATE,
      fk_attendid: r.FK_ATTENDID,
    }));
  });
}

module.exports = {
  getDailyWorksheet,
};