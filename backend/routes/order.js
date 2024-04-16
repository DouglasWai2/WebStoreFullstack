const express = require("express");
const router = express.Router();
require("dotenv").config();
const auth = require("../middlewares/verifyToken");
const {
  createOrder,
  validateOrder,
  createPaymentIntent,
  retrieveOrder,
  paymentIntents,
  getClientSecret,
  markAsDelivered,
  sendProductsToRate,
} = require("../controllers/order.controller");

router.post("/order/create", auth, validateOrder, createOrder);
router.get("/order/payment_intents/:orderId", auth, createPaymentIntent);
router.get("/order/retrieve/:orderId", auth, retrieveOrder);
router.get("/order/payment_status/:payment_intent", auth, paymentIntents);
router.get("/order/payment/:payment_intent", auth, getClientSecret);
router.post("/order/received", auth, markAsDelivered);
router.get("/order/rate/:store_id/:order_id", auth, sendProductsToRate);

module.exports = router;
