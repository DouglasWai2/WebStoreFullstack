const express = require("express");
const { rateProduct, rateStore } = require("../controllers/rating.controller");
const auth = require('../middlewares/verifyToken')
const router = express.Router();


router.post("/rating", auth, rateProduct, rateStore);

module.exports = router;
