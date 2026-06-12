'use strict';

const oracledb = require('oracledb');
const { withConnection } = require("../database/oraclePool");
const logger = require('../config/logger');

async function addEditSalaryHead(payload, actor) {
  const { vsalaryheadid, vheadname, vstatus } = payload;

  logger.info("SalaryHead Payload =>", { vsalaryheadid, vheadname, vstatus, actor });

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN add_edit_salaryhead(:vsalaryheadid, :vheadname, :vstatus, :vcreatedby, :vmessage); END;`,
      {
        vsalaryheadid: vsalaryheadid ? Number(vsalaryheadid) : null,
        vheadname: vheadname || null,
        vstatus: vstatus !== undefined ? Number(vstatus) : 0,
        vcreatedby: actor,
        vmessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      }
    );

    logger.debug("DB RESULT =>", result);
    return { status: true, message: result?.outBinds?.vmessage };
  });
}

async function getSalaryHead() {
  logger.info('Fetching Salary Head list');

  return withConnection(async (conn) => {
    const result = await conn.execute(
      `BEGIN get_salary_head(:retval); END;`,
      { retval: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const rs = result.outBinds.retval;
    const rows = await rs.getRows();
    await rs.close();
    logger.debug(rows);

    return rows.map(row => ({
      salaryheadid: row.SALARYHEADID,
      headname: row.HEADNAME,
      status: row.STATUS
    }));
  });
}

module.exports = {
  addEditSalaryHead,
  getSalaryHead
};