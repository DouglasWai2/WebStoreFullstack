const { register, verifyEmail } = require("../../controllers/register.controller");
const express = require("express");
const router = express.Router();

router.post("/register", register);

router.get('/register/user/verify/:id/:token', verifyEmail)

module.exports = router;
