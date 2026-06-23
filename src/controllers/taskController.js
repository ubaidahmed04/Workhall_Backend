const oracledb = require("oracledb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { withConnection } = require('../database/oraclePool');
// ===================== IMAGE DIRECTORY =====================
const TASK_IMAGE_DIR = path.join(__dirname, "../assets/task_images");

if (!fs.existsSync(TASK_IMAGE_DIR)) {
  fs.mkdirSync(TASK_IMAGE_DIR, { recursive: true });
}

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TASK_IMAGE_DIR);
  },

  filename: (req, file, cb) => {
    // ✅ Backend is now the ONLY source of truth
    const uniqueName = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG images are allowed"), false);
    }
  },
}).single("taskImage");

// ===================== CONTROLLER =====================
exports.addEditTask = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }

    try {
      console.log("➡️ BODY:", req.body);
      console.log("📸 FILE:", req.file?.filename);

      const {
        vtaskid,
        vfk_client,
        vdescription,
        vfk_taskdocid,
        vfk_tasktypeid,
        vassignto,
        vteammembers,
        vfk_branchid,
        vfk_priorityid,
        vfk_taskstatusid,
        vduedate,
        vclientreview,
        vtaskreview,
        vimagestatus,
        vstatus,
        vcomplainby,
      } = req.body;

      const actorId =
        req.user?.id || req.user?.userid || req.body.actorId || null;

      // ✅ THIS is now correct file name saved on disk
      const savedFileName = req.file ? req.file.filename : null;

      await withConnection(async (conn) => {
      conn.callTimeout = 60000;

      const result = await conn.execute(
        `
        BEGIN
          add_edit_task(
            :vtaskid,
            :vfk_client,
            :vdescription,
            :vfk_taskdocid,
            :vtaskdoc,
            :vfk_tasktypeid,
            :vassignto,
            :vteammembers,
            :vfk_branchid,
            :vfk_priorityid,
            :vfk_taskstatusid,
            :vduedate,
            :vclientreview,
            :vtaskreview,
            :vimagestatus,
            :vstatus,
            :vcomplainby,
            :vuserby,
            :vmessage
          );
        END;
        `,
        {
          vtaskid: vtaskid ? Number(vtaskid) : null,
          vfk_client: vfk_client ? Number(vfk_client) : null,
          vdescription: vdescription || null,
          vfk_taskdocid: vfk_taskdocid ? Number(vfk_taskdocid) : null,

          // 🔥 FIX: use backend-generated filename
          vtaskdoc: savedFileName,

          vfk_tasktypeid: vfk_tasktypeid ? Number(vfk_tasktypeid) : null,
          vassignto: vassignto || null,
          vteammembers: vteammembers || null,
          vfk_branchid: vfk_branchid ? Number(vfk_branchid) : null,
          vfk_priorityid: vfk_priorityid ? Number(vfk_priorityid) : null,
          vfk_taskstatusid: vfk_taskstatusid ? Number(vfk_taskstatusid) : null,
          vduedate: vduedate ? new Date(vduedate) : null,
          vclientreview: vclientreview || null,
          vtaskreview: vtaskreview || null,
          vimagestatus: req.file ? 1 : 0,
          vstatus: vstatus !== undefined ? Number(vstatus) : 0,
          vcomplainby: vcomplainby || null,
          vuserby: actorId,

          vmessage: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
          },
        },
        { autoCommit: true },
      );

      const msg = result?.outBinds?.vmessage || "";

      if (msg.startsWith("Error:")) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: msg });
      }

      return res.status(200).json({
        success: true,
        message: msg || "Task created successfully",
        data: {
          image: savedFileName,
        },
      });

        });
    } catch (error) {
      console.error("❌ ERROR:", error);

      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
      }

      return res.status(500).json({
        success: false,
        message: "Task processing failed",
        error: error.message,
      });
    }
  });
};
