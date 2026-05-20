// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditEmpLeave,GetEmpLeaves } = require("../controllers/empLeave.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

router.post("/add-edit", authenticate, authorize([1, 2, 3]),AddEditEmpLeave);

router.get("/get-all", authenticate, GetEmpLeaves);

module.exports = router;