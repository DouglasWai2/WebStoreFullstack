const { refreshToken } = require("../../controllers/refreshToken.controller");
const express = require("express");
const router = express.Router();

router.get("/refresh", refreshToken);

module.exports = router;