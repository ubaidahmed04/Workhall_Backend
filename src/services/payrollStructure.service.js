'use strict';

const oracledb = require('oracledb');
const logger = require('../config/logger');
const { withConnection } = require('../database/oraclePool');

async function addEditpayollStructure(payload, actorId) {
  const {
    vsalarystructureid,
    vfk_empid,
    vfinancialyear,
    vissuedate,
    entries,
    vstatus
  } = payload;

  return withConnection(async (conn) => {
    try {
      for (const entry of entries) {
        const result = await conn.execute(
          `BEGIN
              add_edit_salarystructure(
                :vsalarystructureid,
                :vfk_empid,
                :vfk_salaryheadsid,
                :vamount,
                :vfinancialyear,
                :vissuedate,
                :vstatus,
                :vcreatedby,
                :vmessage
              );
           END;`,
          {
            vsalarystructureid:
              vsalarystructureid
                ? Number(vsalarystructureid)
                : null,

            vfk_empid: Number(vfk_empid),

            vfk_salaryheadsid: Number(
              entry.vfk_salaryheadsid
            ),

            vamount: Number(entry.vamount),

            vfinancialyear:
              vfinancialyear || null,

            vissuedate:
              vissuedate
                ? new Date(vissuedate)
                : null,

            vstatus: entry.vstatus !== undefined ? Number(entry.vstatus) : 0,

            vcreatedby: actorId,

            vmessage: {
              dir: oracledb.BIND_OUT,
              type: oracledb.STRING,
              maxSize: 500
            }
          }
        );

        logger.debug("result service ",result);
      }

      await conn.commit();

      return {
        status: true,
        message:
          vsalarystructureid
            ? 'Successfully Updated'
            : 'Successfully Inserted'
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  });
}

async function getPayrollStructure() {
  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_salarystructure(
            :vretval
          );
      END;`,
      {
        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      }
    );

    const resultSet = result.outBinds.vretval;
    const rows = await resultSet.getRows(10000);
    await resultSet.close();

    return rows.map((row) => ({
      salarystructid: row.SALARYSTRUCTID,
      vfk_empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      vfk_salaryheadsid: row.FK_SALARYHEADSID,
      headname: row.HEADNAME,
      vamount: row.AMOUNT,
      vfinancialyear: row.FINANCIALYEAR,
      vissuedate: row.ISSUEDATE,
      status: row.STATUS,
    }));
  });
}

module.exports = {
  addEditpayollStructure,
  getPayrollStructure
};