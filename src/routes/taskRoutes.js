const express = require("express");
const router = express.Router();

const { addEditTask } = require("../controllers/taskController");

router.post("/task/add-edit", addEditTask);

module.exports = router;
