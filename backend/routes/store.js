const express = require("express");
const {
  registerStore,
  storeInfo,
  addStoreAddress,
  setCpfCnpj,
  changeBanner,
  changeImage,
  autoGenerateCategory,
} = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require("../helpers/upload.helper");

router.get("/store/my-store", auth, storeInfo);
router.get("/store/:storename/:storeid", storeInfo);
router.post("/store/register-store", auth, upload.single("storeImage"), registerStore);
router.post("/store/address", auth, addStoreAddress);
router.post("/store/set-id", auth, setCpfCnpj);
router.post("/store/change-banner", auth, upload.single("file"), changeBanner);
router.post("/store/change-image", auth, upload.single("file"), changeImage);

module.exports = router;
