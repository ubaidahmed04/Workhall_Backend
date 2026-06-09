// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditLeave,GetLeaves } = require("../controllers/leave.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const checkAccess = require("../middleware/checkAccess.middleware");

router.post("/add-edit", authenticate, checkAccess("Assign Leaves"),
    // authorize([1, 2, 3]),
    AddEditLeave);

router.get("/get-all", authenticate, GetLeaves);

module.exports = router;
