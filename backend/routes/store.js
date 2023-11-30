const express = require("express");
const { registerStore, storeInfo, addStoreAddress, setCpfCnpj } = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require('../helpers/upload.helper')

router.post("/store/register-store", auth , upload.single('storeImage'), registerStore);
router.get("/store/my-store", auth,  storeInfo);
router.post("/store/address", auth,  addStoreAddress);
router.post("/store/set-id", auth,  setCpfCnpj);

module.exports = router;
