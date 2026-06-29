const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');

/**
 * ========================
 * CHECK-IN API
 * ========================
 */
exports.checkInAttendance = async (req, res) => {
  try {
    console.log(" CHECK-IN REQUEST:", req.body);

    const {
      fk_empid,
      longitude,
      latitude,
      radius,
      branchid,
      internetname,
      ip,
      internettype,
      worksheet,
      createdby,
    } = req.body;

    if (
      fk_empid == null ||
      longitude == null ||
      latitude == null ||
      branchid == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    await withConnection(async (conn) => {

      const result = await conn.execute(
        `
      BEGIN
        add_edit_attendence_app(
          :vfk_empid,
          :vlongitude,
          :vlatitude,
          :vradius,
          :vbranchid,
          :vinternetname,
          :vip,
          :vinternettype,
          :vworksheet,
          :vcreatedby,
          :vtype,
          :vmessage
        );
      END;
      `,
        {
          vfk_empid: Number(fk_empid),
          vlongitude: Number(longitude),
          vlatitude: Number(latitude),
          vradius: radius !== undefined &&
            radius !== null &&
            radius !== ""
            ? Number(radius)
            : null,
          vbranchid: Number(branchid),

          vinternetname: internetname,
          vip: ip,
          vinternettype: internettype,
          vworksheet: worksheet,
          vcreatedby: createdby,

          vtype: "attendenceworkhall",

          vmessage: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
          },
        },
        { autoCommit: true },
      );

      const message = result.outBinds.vmessage || "Check-in processed";

      return res.status(200).json({
        success: true,
        message,
      });

    });
  } catch (error) {
    console.error(" CHECK-IN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Check-in failed",
      error: error.message,
    });
  }
};

/**
 * =========================
 * CHECK-OUT API
 * =========================
 */
exports.checkOutAttendance = async (req, res) => {
  try {
    console.log(" CHECK-OUT REQUEST:", req.body);

    const {
      fk_empid,
      longitude,
      latitude,
      radius,
      branchid,
      internetname,
      ip,
      internettype,
      worksheet,
      createdby,
    } = req.body;

    if (
      fk_empid == null ||
      longitude == null ||
      latitude == null ||
      branchid == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    await withConnection(async (conn) => {

      const result = await conn.execute(
        `
      BEGIN
        add_edit_attendence_app(
          :vfk_empid,
          :vlongitude,
          :vlatitude,
          :vradius,
          :vbranchid,
          :vinternetname,
          :vip,
          :vinternettype,
          :vworksheet,
          :vcreatedby,
          :vtype,
          :vmessage
        );
      END;
      `,
        {
          vfk_empid: Number(fk_empid),
          vlongitude: Number(longitude),
          vlatitude: Number(latitude),
          vradius: radius !== undefined &&
            radius !== null &&
            radius !== ""
            ? Number(radius)
            : null,
          vbranchid: Number(branchid),

          vinternetname: internetname,
          vip: ip,
          vinternettype: internettype,
          vworksheet: worksheet,
          vcreatedby: createdby,

          vtype: "attendenceworkhall",

          vmessage: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
          },
        },
        { autoCommit: true },
      );

      const message = result.outBinds.vmessage || "Check-out processed";

      return res.status(200).json({
        success: true,
        message,
      });

    });
  } catch (error) {
    console.error("❌ CHECK-OUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Check-out failed",
      error: error.message,
    });
  }
};
