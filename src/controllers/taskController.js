const fs = require("fs");
const { addTask } = require("../services/task.service");
const { buildImageUrl } = require("../helpers/buildImageUrl");

exports.addEditTask = async (req, res) => {
  try {
    const actorId =
      req.user?.id ||
      req.user?.userid ||
      req.body.actorId ||
      "SYSTEM";

    // Save full image URL if image uploaded
    if (req.file) {
      req.body.vtaskdoc = buildImageUrl(req.file.vtaskdoc);
      req.body.vimagestatus = 1;
    } else {
      req.body.vimagestatus = 0;
    }

    const result = await addTask(req.body, actorId);

    if (!result.status) {
      // Delete uploaded file if procedure failed
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error(err);
        }
      }

      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message || "Task saved successfully",
      data: {
        image: req.body.vtaskdoc,
      },
    });

  } catch (error) {
    console.error("AddEditTask Error =>", error);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};