const express = require("express");
const { handleWebhook } = require("../controllers/webhook.controller");
const router = express.Router();
require("dotenv").config();

router.post("/", handleWebhook)

module.exports = router