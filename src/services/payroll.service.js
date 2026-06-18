'use strict';

const oracledb = require('oracledb');
const logger = require('../config/logger');
const { withConnection } = require('../database/oraclePool');

const addEditPayslipService = async (payload) => {
  const {
    vpayslipid, vfk_empid, vfk_departmentid,
    vchequeno, vmonthName, vyear, vpaydate,
    vstatus, vcreatedby, entries,
  } = payload;

  return withConnection(async (conn) => {
    try {
      //  Edit case: purani rows hata do
      if (vpayslipid) {
        await conn.execute(
          `DELETE FROM payslip 
            WHERE fk_empid = :empid 
              AND monthname = :month 
              AND year = :year 
              AND status = 0`,
          {
            empid: Number(vfk_empid),
            month: vmonthName,
            year: Number(vyear),
          }
        );
      }

      // ✅ Har entry ke liye fresh INSERT (vpayslipid = null)
      for (const entry of entries) {
        const result = await conn.execute(
          `BEGIN
              add_edit_payslip(
                :vpayslipid,
                :vfk_empid,
                :vfk_departmentid,
                :vfk_salaryheadsid,
                :vearning,
                :vdeduction,
                :vchequeno,
                :vmonthName,
                :vyear,
                TO_DATE(:vpaydate,'YYYY-MM-DD'),
                :vstatus,
                :vcreatedby,
                :vmessage
              );
           END;`,
          {
            vpayslipid: null, // DELETE ke baad fresh insert
            vfk_empid: Number(vfk_empid),
            vfk_departmentid: vfk_departmentid ? Number(vfk_departmentid) : null,
            vfk_salaryheadsid: Number(entry.vfk_salaryheadsid),
            vearning: Number(entry.vearning || 0),
            vdeduction: Number(entry.vdeduction || 0),
            vchequeno: vchequeno ? Number(vchequeno) : null,
            vmonthName,
            vyear: Number(vyear),
            vpaydate,
            vstatus: 0,
            vcreatedby: vcreatedby || "system",
            vmessage: {
              dir: oracledb.BIND_OUT,
              type: oracledb.STRING,
              maxSize: 500,
            },
          }
        );
        console.log("Row inserted:", result.outBinds.vmessage);
      }

      await conn.commit();
      return { success: true, message: "Payslip successfully updated" };

    } catch (error) {
      await conn.rollback();
      console.error("Payslip Service Error:", error);
      throw error;
    }
  });
};

const getPayslipService = async (empid, month) => {
  return withConnection(async (conn) => {
    try {
      const result = await conn.execute(
        `BEGIN
            get_payslip_web(:vempid, :vdate , :retval);
         END;`,
        {
          vempid: null,
          vdate: null,
          retval: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR,
          },
        }
      );

      const resultSet = result.outBinds.retval;

      const rows = await resultSet.getRows(10000);
      await resultSet.close();

      return rows.map((row) => ({
        vpayslipid: row.PAYSLIPID,
        vfk_empid: row.FK_EMPID,
        firstname: row.FIRSTNAME,
        lastname: row.LASTNAME,
        vfk_departmentid: row.FK_DEPARTMENTID,
        depname: row.DEPNAME,
        vchequeno: row.CHEQUENO,
        vmonthname: row.MONTHNAME,
        vfk_salaryheadsid: row.FK_SALARYHEADSID,
        headname: row.HEADNAME,
        vearning: row.EARNING,
        vdeduction: row.DEDUCTION,
        vseq: row.SEQ,
        vyear: row.YEAR,
        vpaydate: row.PAYDATE,
      }));
    } catch (error) {
      logger.error("getPayslipService Error =>", error);
      throw error;
    }
  });
};

const getPayslipById = async (empid, month, year) => {
   const vdate = year && month 
    ? new Date(`${month} 1, ${year}`) 
    : null;
  return withConnection(async (conn) => {
    try {
      const result = await conn.execute(
        `BEGIN
            get_payslip_by_id(:vempid, :vdate , :retval);
         END;`,
        {
          vempid: empid || null,
          vdate:  vdate || null,
          retval: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR,
          },
        },
        {
          // 🟩 YE OPTION ADD KAREIN: Taake row.PAYSLIPID chale, row[0] na likhna pare
          outFormat: oracledb.OUT_FORMAT_OBJECT 
        }
      );

      const resultSet = result.outBinds.retval;
      const rows = await resultSet.getRows(10000);
      await resultSet.close();

      // Agar data phir bhi na aaye, to check karein ke Oracle keys UPPERCASE me deta hai
      return rows.map((row) => ({
        vpayslipid: row.PAYSLIPID,
        vfk_empid: row.FK_EMPID,
        firstname: row.FIRSTNAME,
        lastname: row.LASTNAME,
        vfk_departmentid: row.FK_DEPARTMENTID,
        depname: row.DEPNAME,
        vchequeno: row.CHEQUENO,
        vmonthname: row.MONTHNAME,
        vfk_salaryheadsid: row.FK_SALARYHEADSID,
        headname: row.HEADNAME,
        vearning: row.EARNING,
        vdeduction: row.DEDUCTION,
        vseq: row.SEQ,
        vyear: row.YEAR,
        vpaydate: row.PAYDATE,
      }));
    } catch (error) {
      logger.error("getPayslipService Error =>", error);
      throw error;
    }
  });
};
const softDeletePayslipService = async ({ vfk_empid, vmonthName, vyear }) => {
  return withConnection(async (conn) => {
    try {
      await conn.execute(
        `UPDATE payslip 
            SET status = 1 
          WHERE fk_empid = :empid 
            AND monthname = :month 
            AND year = :year 
            AND status = 0`,
        {
          empid: Number(vfk_empid),
          month: vmonthName,
          year: Number(vyear),
        }
      );
      await conn.commit();
      return { message: "Payslip deleted successfully" };
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  });
};

async function getSalaryStructureByEmp(vempid) {
  return withConnection(async (conn) => {
    logger.debug("vempid===>>>>>",vempid)
    try {
      const result = await conn.execute(
        `BEGIN
            get_salarystructure_emp(
              :vempid,
              :vretval
            );
         END;`,
        {
          vempid: vempid ? String(vempid) : null,
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
        headname: row.SALARY_HEAD_NAME,
        vamount: row.AMOUNT,
        vfinancialyear: row.FINANCIALYEAR,
        status: row.STATUS,
        createdby: row.CREATEDBY,
        editby: row.EDITBY,
        vissuedate: row.ISSUEDATE,
      }));
    } catch (error) {
      logger.error('getSalaryStructureByEmployee error =>', error);
      throw error;
    }
  });
}

module.exports = {
  addEditPayslipService,
  getPayslipService,
  getPayslipById,
  softDeletePayslipService,
  getSalaryStructureByEmp
};