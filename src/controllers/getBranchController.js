const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * ==================================
 * GET BRANCH API
 * ==================================
 */
exports.getBranch = async (req, res) => {
  try {
    console.log("➡️ GET BRANCH REQUEST");

    await withConnection(async (conn) => {

    console.log("✅ Oracle connection acquired");

    const result = await conn.execute(
      `
      BEGIN
        get_branch(:retval);
      END;
      `,
      {
        retval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    const resultSet = result.outBinds.retval;

    const rows = await resultSet.getRows(100000);

    await resultSet.close();

    console.log(`📦 TOTAL BRANCHES: ${rows.length}`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });

      });
  } catch (error) {
    console.error("❌ GET BRANCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
      oracleCode: error.code,
    });
  }
};
