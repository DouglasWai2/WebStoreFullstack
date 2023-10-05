const express = require("express");
const { addClothes } = require("../controllers/clothes.controller");
const auth = require('../middlewares/verifyToken')
const router = express.Router();
const upload = require("../helpers/upload.helper");

/* ----------------------- upload and error handling ----------------------- */
router.post("/clothes/:access_token", auth, upload.array("images", 5), addClothes);

module.exports = router;
