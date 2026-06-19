'use strict';

const oracledb = require('oracledb');
const { withConnection } = require('../database/oraclePool');
const logger = require('../config/logger');

async function addEditAllowance(
  payload,
  actorId
) {
  const {
    valllowanceid,
    vfk_empid,
    vfk_salaryheadid,
    vamount,
    vallowancedate,
    vremarks,
    vstatus
  } = payload;

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          add_edit_allowancetrans(
            :valllowanceid,
            :vfk_empid,
            :vfk_salaryheadid,
            :vamount,
            :vallowancedate,
            :vremarks,
            :vstatus,
            :vcreatedby,
            :vmessage
          );
      END;`,
      {
        valllowanceid:
          valllowanceid
            ? Number(valllowanceid)
            : null,

        vfk_empid:
          vfk_empid
            ? Number(vfk_empid)
            : null,

        vfk_salaryheadid:
          vfk_salaryheadid
            ? Number(vfk_salaryheadid)
            : null,

        vamount:
          vamount
            ? Number(vamount)
            : 0,

        vallowancedate:
          vallowancedate
            ? new Date(vallowancedate)
            : null,

        vremarks:
          vremarks || null,

        vstatus:
          vstatus !== undefined
            ? Number(vstatus)
            : 0,

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
      status: true,
      message:
        result?.outBinds?.vmessage
    };
  });
}
async function getAllowanceTransaction() {
  logger.info('Fetching Allowance Transactions');

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_allowancetransaction(:retval);
       END;`,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR
        }
      }
    );

    const resultSet =
      result.outBinds.retval;

    const rows =
      await resultSet.getRows();

    await resultSet.close();

    logger.debug(rows);

    return rows.map((row) => ({
      allowanceid: row.ALLOWANCEID,
      fk_empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      fk_salaryheadid:
        row.FK_SALARYHEADID,
      headname: row.HEADNAME,
      amount: row.AMOUNT,
      allowancedate:
        row.ALLOWANCEDATE,
      remarks: row.REMARKS,
      status: row.STATUS
    }));
  });
}

async function getAllowanceReport(empid, date) {
  logger.info("Fetching Allowance Report");

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN
          get_allowancetrans_report(
            :vempid,
            :vdate,
            :retval
          );
       END;`,
      {
        vempid: empid || null,
        vdate: { val: date ? new Date(date) : null, type: oracledb.DATE },
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const resultSet = result.outBinds.retval;

    const rows = await resultSet.getRows(10000);

    await resultSet.close();

    return rows.map((row) => ({
      fk_empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      fk_salaryheadid: row.FK_SALARYHEADID,
      headname: row.HEADNAME,
      total: row.TOTAL,
      allowancedate: row.ALLOWANCEDATE,
      status: row.STATUS,
    }));
  });
}


module.exports = {
  addEditAllowance,
  getAllowanceTransaction,
  getAllowanceReport
};