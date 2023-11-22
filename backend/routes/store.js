const express = require("express");
const { registerStore } = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require('../helpers/upload.helper')

router.post("/store/register-store/:access_token", auth, upload.single('storeImage'), registerStore);

module.exports = router;
