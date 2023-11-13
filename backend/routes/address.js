const express = require("express");
const auth = require('../middlewares/verifyToken')
const {addressController, sendAddressInfo, updateMainAddress} = require('../controllers/address.controller')
const router = express.Router();


router.post("/address/:access_token", auth, addressController);

router.get("/address/set/:address_id/:access_token", auth, updateMainAddress);

router.get('/address/:access_token', auth, sendAddressInfo)

module.exports = router;