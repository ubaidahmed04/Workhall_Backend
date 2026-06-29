const express = require("express");
const router = express.Router();

const { addEditTask } = require("../controllers/taskController");
const upload = require("../middleware/upload");

router.post("/task/add-edit", upload.single("taskImage"),addEditTask);

module.exports = router;
