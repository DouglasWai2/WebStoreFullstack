const express = require("express");
const router = express.Router();
const auth = require("../middlewares/verifyToken");
const { redirectME, getTokens, calculateShipment } = require("../controllers/shipment.controller");


router.get("/frete", redirectME);

router.get("/frete/callback", getTokens);

router.post("/shipment-calculate", calculateShipment);

module.exports = router;
