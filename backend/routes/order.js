const express = require("express");
const router = express.Router();
require("dotenv").config();
const auth = require("../middlewares/verifyToken");
const { createOrder, validateOrder, createPaymentIntent } = require("../controllers/order.controller");

router.post("/order/create", auth, validateOrder, createOrder);
router.get("/order/payment_intents/:orderId", auth, createPaymentIntent);

module.exports = router;
