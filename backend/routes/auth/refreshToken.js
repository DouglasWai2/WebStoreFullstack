const { refreshToken } = require("../../controllers/refreshToken.controller");
const express = require("express");
const router = express.Router();

router.post("/refresh", refreshToken);

module.exports = router;