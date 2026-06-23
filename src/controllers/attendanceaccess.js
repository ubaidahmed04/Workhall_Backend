const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

exports.getAttendanceAccess = async (req, res) => {
  try {
    console.log("➡️ ATTENDANCE ACCESS REQUEST:", req.body);

    const { longitude, latitude, radius } = req.body;

    if (!longitude || !latitude || !radius) {
      return res.status(400).json({
        success: false,
        message: "Longitude, Latitude and Radius are required",
      });
    }

    await withConnection(async (conn) => {
    console.log("✅ Oracle connection acquired");

    let rows = [];
    let accessStatus = 0;

    // =========================
    // STEP 1: TRY PROCEDURE
    // =========================
    try {
      const result = await conn.execute(
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
        },
      );

      const resultSet = result.outBinds.vretval;

      rows = await resultSet.getRows(100);

      await resultSet.close();

      console.log("📊 PROCEDURE RESULT:", rows);

      if (rows && rows.length > 0) {
        // Column 3 = ACCESS_STATUS
        accessStatus = Number(rows[0][2]);
      }
    } catch (procError) {
      console.log("⚠️ PROCEDURE FAILED");
      console.log(procError.message);

      return res.status(500).json({
        success: false,
        message: "Wrong Branch Location",
        accessStatus: 0,
        branchName: null,
        error: procError.message,
      });
    }

    // =========================
    // STEP 2: FETCH BRANCH NAME
    // =========================
    let branchName = null;
    let branchId = null;

    try {
      if (rows && rows.length > 0) {
        branchId = rows[0][0];
        branchName = rows[0][1];
      }
    } catch (e) {
      console.log("⚠️ branch fetch error:", e.message);
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
    console.error("❌ ATTENDANCE ACCESS ERROR");
    console.error(error);

    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENOTFOUND" ||
      (error.message && error.message.includes("ORA-12170")) ||
      (error.message && error.message.includes("ORA-12541")) ||
      (error.message && error.message.includes("ORA-12514"));

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
