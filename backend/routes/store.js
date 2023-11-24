const express = require("express");
const { registerStore, storeInfo, addStoreAddress, setCpfCnpj } = require("../controllers/store.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require('../helpers/upload.helper')

router.post("/store/register-store/:access_token", auth, upload.single('storeImage'), registerStore);
router.get("/store/my-store/:access_token", auth,  storeInfo);
router.post("/store/address/:access_token", auth,  addStoreAddress);
router.post("/store/set-id/:access_token", auth,  setCpfCnpj);

module.exports = router;
