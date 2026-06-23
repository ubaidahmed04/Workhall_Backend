const oracledb = require("oracledb");
const { withConnection } = require('../database/oraclePool');
const path = require("path");
const fs = require("fs");

/**
 * =====================================
 * GET TASK API
 * =====================================
 */
exports.getTask = async (req, res) => {
  try {
    console.log("➡️ GET TASK REQUEST:", req.body);

    const { fromDate, toDate, empid, taskstatus } = req.body;

    await withConnection(async (conn) => {

    const result = await conn.execute(
      `
      BEGIN
        get_task(
          TO_DATE(:vfromdate, 'YYYY-MM-DD'),
          TO_DATE(:vtodate, 'YYYY-MM-DD'),
          :vempid,
          :vtaskstatus,
          :vretval
        );
      END;
      `,
      {
        vfromdate: fromDate || null,
        vtodate: toDate || null,
        vempid: empid ? Number(empid) : null,
        vtaskstatus: taskstatus ? Number(taskstatus) : null,
        vretval: {
          dir: oracledb.BIND_OUT,
          type: oracledb.CURSOR,
        },
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const resultSet = result.outBinds.vretval;
    const rows = await resultSet.getRows(100000);
    await resultSet.close();

    // ✅ FIX: normalize image URLs for frontend
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const formattedRows = rows.map((task) => {
      let image = task.IMAGE || task.TASK_IMAGE || task.image_url;

      if (!image) return task;

      // remove localhost issues
      image = image.replace("localhost:3000", req.get("host"));

      // if already full URL
      if (image.startsWith("http")) {
        return {
          ...task,
          image_url: image,
        };
      }

      // if filename only → serve from backend route
      return {
        ...task,
        image_url: `${baseUrl}/api/task/image/${image}`,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows,
    });

      });
  } catch (error) {
    console.error("❌ GET TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

/**
 * =====================================
 * GET TASK IMAGE API
 * =====================================
 */
exports.getTaskImage = async (req, res) => {
  try {
    const filename = req.params.filename;

    if (!filename || !filename.match(/^[a-zA-Z0-9_.-]+$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename",
      });
    }

    const imagePath = path.join(__dirname, "../../assets/task_images", filename);

    if (!fs.existsSync(imagePath)) {
      console.log("Image not found:", imagePath);
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.sendFile(imagePath);
  } catch (error) {
    console.error("IMAGE API ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Image fetch failed",
    });
  }
};
