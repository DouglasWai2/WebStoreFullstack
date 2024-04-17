const express = require("express");
const { rateProduct } = require("../controllers/rating.controller");
const auth = require('../middlewares/verifyToken')
const router = express.Router();


router.post("/rating", auth, rateProduct);

module.exports = router;
