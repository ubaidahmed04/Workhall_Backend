const oracledb = require("oracledb");
const { withConnection } = require("../database/oraclePool");

exports.getAttendanceAccess = async (req, res) => {
  try {
    console.log(" ATTENDANCE ACCESS REQUEST:", req.body);

    const { longitude, latitude, radius } = req.body;

    if (
      longitude === undefined ||
      latitude === undefined ||
      radius === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Longitude, Latitude and Radius are required",
      });
    }

    await withConnection(async (connection) => {
      let rows = [];
      let accessStatus = 0;

      try {
        const result = await connection.execute(
          `
          BEGIN
              get_attendence_access(
                  :vlongtitude,
                  :vlatitude,
                  :vradius,
                  :vretval
              );
          END;
          `,
          {
            vlongtitude: Number(longitude),
            vlatitude: Number(latitude),
            vradius: Number(radius),
            vretval: {
              dir: oracledb.BIND_OUT,
              type: oracledb.CURSOR,
            },
          }
        );

        const resultSet = result.outBinds.vretval;

        rows = await resultSet.getRows(100);

        await resultSet.close();

        console.log("📊 PROCEDURE RESULT:", rows);

        if (rows.length > 0) {
          const row = rows[0];

          if (Array.isArray(row)) {
            accessStatus = Number(row[2] || 0);
          } else {
            accessStatus = Number(
              row.ACCESS_STATUS ??
              row.access_status ??
              row.accessStatus ??
              0
            );
          }
        }
      } catch (procError) {
        console.error(" PROCEDURE ERROR:", procError);

        return res.status(500).json({
          success: false,
          message: "Wrong Branch Location",
          accessStatus: 0,
          branchId: null,
          branchName: null,
          error: procError.message,
        });
      }

      let branchId = null;
      let branchName = null;

      if (rows.length > 0) {
        const row = rows[0];

        if (Array.isArray(row)) {
          branchId = row[0];
          branchName = row[1];
        } else {
          branchId =
            row.BRANCHID ??
            row.branchid ??
            row.branchId ??
            null;

          branchName =
            row.BRANCHNAME ??
            row.branchname ??
            row.branchName ??
            null;
        }
      }

      return res.status(200).json({
        success: true,
        message:
          accessStatus === 1
            ? "Attendance Access Granted"
            : "Wrong Branch Location",

        accessStatus,
        branchId,
        branchName,
        data: rows,
      });
    });
  } catch (error) {
    console.error("❌ ATTENDANCE ACCESS ERROR:", error);

    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENOTFOUND" ||
      error.message?.includes("ORA-12170") ||
      error.message?.includes("ORA-12541") ||
      error.message?.includes("ORA-12514");

    if (isNetworkError) {
      return res.status(503).json({
        success: false,
        message: "Network connection failed please check your internet",
        error: error.message,
        oracleCode: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Attendance Access Failed",
      error: error.message,
      oracleCode: error.code,
    });
  }
};