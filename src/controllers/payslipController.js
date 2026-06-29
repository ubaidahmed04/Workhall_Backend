const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET PAYSLIP API
 * =====================================
 */
exports.getPayslip = async (req, res) => {
  try {
    console.log(" GET PAYSLIP REQUEST:", req.body);

    const { empid, paydate } = req.body;

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_Payslip(
          :vempid,
          TO_DATE(:vdate, 'YYYY-MM-DD'),
          :vretval
        );
      END;
      `,
      {
        vempid: empid ? Number(empid) : null,
        vdate: paydate || null,

        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.vretval;
    const rows = await resultSet.getRows(100000);

    await resultSet.close();

    const formattedRows = rows.map((row) => ({
      payslipid: row.PAYSLIPID,
      empid: row.FK_EMPID,
      firstname: row.FIRSTNAME,
      lastname: row.LASTNAME,
      departmentid: row.FK_DEPARTMENTID,
      department: row.DEPNAME,
      chequeno: row.CHEQUENO,
      monthname: row.MONTHNAME,
      salaryheadid: row.FK_SALARYHEADSID,
      salaryhead: row.HEADNAME,
      earning: row.EARNING,
      deduction: row.DEDUCTION,
      seq: row.SEQ,
      year: row.YEAR,
      paydate: row.PAYDATE,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET PAYSLIP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payslip",
      error: error.message,
    });
  }
};
