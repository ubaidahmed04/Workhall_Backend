const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * ==================================
 * GET EMPLOYEES API
 * ==================================
 */
exports.getEmployees = async (req, res) => {
  try {
    console.log("➡️ GET EMPLOYEES REQUEST:", req.body);

    // 1. Extract parameters from request body
    const { voffset, vlimit, vtype } = req.body;

    // 2. Set defaults (matching the procedure's DEFAULT 'current')
    const offset =
      voffset !== undefined && voffset !== null && voffset !== ""
        ? Number(voffset)
        : 0;

    const limit =
      vlimit !== undefined && vlimit !== null && vlimit !== ""
        ? Number(vlimit)
        : 50;

    const type =
      vtype !== undefined && vtype !== null && vtype !== "" ? vtype : "current"; // default is 'current' as per procedure

    // 3. Acquire connection
    await withConnection(async (conn) => {

    console.log("✅ Oracle connection acquired");

    // 4. Execute the stored procedure (now with vtype)
    const result = await conn.execute(
      `
      BEGIN
        get_employees(   -- ← procedure name updated
          :voffset,
          :vlimit,
          :vtype,
          :retval
        );
      END;
      `,
      {
        voffset: {
          val: offset,
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
        },
        vlimit: {
          val: limit,
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
        },
        vtype: {
          val: type,
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
        },
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    // 5. Process result set
    const resultSet = result.outBinds.retval;
    const rows = await resultSet.getRows(100000);
    await resultSet.close();

    console.log(`📦 TOTAL EMPLOYEES: ${rows.length}`);

    // 6. Send response
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
      });
  } catch (error) {
    console.error("❌ GET EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
      oracleCode: error.code,
    });
  }
};
