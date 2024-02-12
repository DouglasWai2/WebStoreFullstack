const { login, googleAuth, googleCallback } = require("../../controllers/login.controller");
const express = require("express");
const router = express.Router();

router.post("/login", login);

router.post("/login/google", googleAuth)

module.exports = router;
