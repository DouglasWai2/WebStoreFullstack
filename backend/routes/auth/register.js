const { register } = require("../../controllers/register.controller");
const express = require("express");
const router = express.Router();

router.post("/register", register);

module.exports = router;
