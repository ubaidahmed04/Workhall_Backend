// routes/leavetype.routes.js

const router = require("express").Router();
const { AddEditEmpLeave,GetEmpLeaves } = require("../controllers/empLeave.controller");

router.post("/add-edit",AddEditEmpLeave);

router.get("/get-all",GetEmpLeaves);

module.exports = router;