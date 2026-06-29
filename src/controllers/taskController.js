const { addTask } = require("../services/task.service");
const fs = require("fs");
exports.addEditTask = async (req, res) => {
    try {

        const actorId =
            req.user?.id ||
            req.user?.userid ||
            req.body.actorId ||
            null;

        const payload = {
            ...req.body,
            vtaskdoc: req.file?.filename || null,
            vimagestatus: req.file ? 1 : 0
        };

        const result = await addTask(payload, actorId);

        if (!result.status) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json(result);
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                image: payload.vtaskdoc
            }
        });

    } catch (err) {

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch {}
        }

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }
};