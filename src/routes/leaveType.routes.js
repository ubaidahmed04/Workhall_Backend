// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditLeaveType,GetLeaveTypes } = require("../controllers/leavetype.controller");

router.post("/add-edit",AddEditLeaveType);

router.get("/get-all",GetLeaveTypes);

module.exports = router;