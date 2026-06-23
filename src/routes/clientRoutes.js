const express = require("express");
const router = express.Router();

const { getClient } = require("../controllers/getClientController");

// GET CLIENT LIST
router.post("/client/get", getClient);

module.exports = router;
