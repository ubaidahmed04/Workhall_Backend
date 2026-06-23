const express = require("express");
const router = express.Router();

const { addEditTask } = require("../controllers/taskController");

router.post("/task/app/add-edit", addEditTask);

module.exports = router;
