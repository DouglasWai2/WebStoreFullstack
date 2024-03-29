const express = require("express");
const router = express.Router();
const auth = require("../middlewares/verifyToken");
const {
  saveAddress,
  updateMainAddress,
  deleteAddress,
  sendUserInfo,
  updateUserData,
  likeStore,
  getUsersInterests,
  cart,
  orders
} = require("../controllers/user.controller");
require("dotenv").config();

router.get("/user", auth, sendUserInfo);
router.post("/user/interests", getUsersInterests);
router.post("/user/update", auth, updateUserData);
router.post("/user/like_store", auth, likeStore);
router.post("/user/address", auth, saveAddress);
router.get("/user/address/set/:address_id", auth, updateMainAddress);
router.get("/user/address/delete/:address_id", auth, deleteAddress);
router.post("/user/cart", auth, cart)
router.get("/user/orders", auth, orders)

module.exports = router;
