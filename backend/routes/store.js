const express = require("express");
const { registerStore, storeInfo, addStoreAddress, setCpfCnpj, changeBanner } = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require('../helpers/upload.helper')

router.post("/store/register-store", auth , upload.single('storeImage'), registerStore);
router.get("/store/my-store", auth,  storeInfo);
router.post("/store/address", auth,  addStoreAddress);
router.post("/store/set-id", auth,  setCpfCnpj);
router.post("/store/change-banner", auth, upload.single('file[]'), changeBanner);

module.exports = router;
