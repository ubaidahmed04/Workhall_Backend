// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditLeave,GetLeaves } = require("../controllers/leave.controller");

router.post("/add-edit",AddEditLeave);

router.get("/get-all",GetLeaves);

module.exports = router;