const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * =====================================
 * GET ROLE PERMISSIONS (MOBILE APP)
 * =====================================
 */
exports.getRolePermissions = async (req, res) => {
  try {
    console.log("➡️ GET ROLE PERMISSIONS REQUEST:", req.body);

    const { roleid } = req.body;

    if (!roleid) {
      return res.status(400).json({
        success: false,
        message: "roleid is required",
      });
    }

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_role_permissions_app(
          :vroleid,
          :vretval
        );
      END;
      `,
      {
        vroleid: Number(roleid),

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
      modulepermid: row.MODULEPERMID,
      roleid: row.FK_ROLEID,
      moduleid: row.FK_MODULEID,
      modulename: row.MODULENAME,
      permission: row.PERMISSION,
      status: row.STATUS,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET ROLE PERMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions",
      error: error.message,
    });
  }
};
