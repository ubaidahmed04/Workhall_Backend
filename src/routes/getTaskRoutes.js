const express = require("express");
const router = express.Router();

const { getTask, getTaskImage } = require("../controllers/getTaskController");

router.post("/task/get", getTask);

//  image route
router.get("/task/image/:filename", getTaskImage);

module.exports = router;
