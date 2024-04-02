const express = require("express");
const {
  registerStore,
  storeInfo,
  addStoreAddress,
  setCpfCnpj,
  changeBanner,
  changeImage,
  myProducts,
  deleteProducts,
  discountProducts,
  getCarouselImages,
  sendOrders,
  sendOrderDetails,
  setOrderStatus,
} = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require("../helpers/upload.helper");

router.get("/store/my-store", auth, storeInfo);
router.get("/store/my-products", auth, myProducts);
router.get("/store/my-store/orders", auth, sendOrders);
router.get("/store/my-store/orders/:order_id", auth, sendOrderDetails);
router.post("/store/my-store/order/status", auth, setOrderStatus);
router.get("/store/:storename/:storeid", storeInfo);
router.post("/store/register-store", auth, upload.single("storeImage"), registerStore);
router.post("/store/address", auth, addStoreAddress);
router.post("/store/set-id", auth, setCpfCnpj);
router.post("/store/change-banner", auth, upload.array("files[]", 3), changeBanner);
router.post("/store/change-image", auth, upload.single("file"), changeImage);
router.post("/store/my-store/delete-products", auth, deleteProducts);
router.post("/store/my-store/discount-products", auth, discountProducts);
router.post("/store/get-carousel-images", getCarouselImages);



module.exports = router;
