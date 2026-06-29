const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * ==================================
 * GET CLIENT API
 * ==================================
 */
exports.getClient = async (req, res) => {
  try {
    console.log(" GET CLIENT REQUEST:", req.body);

    const { startdate, enddate, clientid } = req.body;

    await withConnection(async (conn) => {

    console.log(" Oracle connection acquired");

    const result = await conn.execute(
      `
      BEGIN
        get_client(
          TO_DATE(:vstartdate, 'YYYY-MM-DD'),
          TO_DATE(:venddate, 'YYYY-MM-DD'),
          :vclientid,
          :vretval
        );
      END;
      `,
      {
        vstartdate: startdate || null,
        venddate: enddate || null,

        vclientid:
          clientid !== undefined && clientid !== null && clientid !== ""
            ? Number(clientid)
            : null,

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

    console.log(` TOTAL CLIENTS: ${rows.length}`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });

      });
  } catch (error) {
    console.error(" GET CLIENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
      oracleCode: error.code,
    });
  }
};
