// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditLeaveType,GetLeaveTypes } = require("../controllers/leaveType.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const checkAccess = require("../middleware/checkAccess.middleware");

router.post("/add-edit", authenticate, checkAccess("Leave Types"),
    // authorize([1, 2, 3]),
    AddEditLeaveType);

router.get("/get-all", authenticate, GetLeaveTypes);

module.exports = router;
