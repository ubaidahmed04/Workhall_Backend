// services/dailyWorksheet.service.js

const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");
const logger = require("../config/logger");

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

const getDailyWorksheetEmp = async (empId, fromDate, toDate) => {
    logger.info('Fetching Daily Worksheet Employee Report');

    return withConnection(async (conn) => {
        const result = await conn.execute(
            `BEGIN
                get_dailyworksheet_emp(
                    :vempid,
                    :vfromdate,
                    :vtodate,
                    :retval
                );
            END;`,
            {
                vempid: empId ? Number(empId) : null,
                vfromdate: fromDate ? new Date(fromDate) : null,
                vtodate: toDate ? new Date(toDate) : null,
                retval: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const resultSet = result.outBinds.retval;
        const rows = await resultSet.getRows();
        await resultSet.close();

        logger.debug(rows);

        return rows.map(row => ({
            fk_empid: row.FK_EMPID,
            dailyworkid: row.DAILYWORKID,
            fullname: row.FULLNAME,
            workdetail: row.WORKDETAIL,
            workdate: row.WORKDATE,
            fk_attendid: row.FK_ATTENDID,
        }));
    });
};

module.exports = {
  getDailyWorksheet,
  getDailyWorksheetEmp
};