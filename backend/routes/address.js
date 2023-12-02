const express = require("express");
const auth = require('../middlewares/verifyToken')
const {addressController, sendAddressInfo, updateMainAddress, deleteAddress} = require('../controllers/address.controller')
const router = express.Router();


router.post("/address", auth, addressController);

router.get("/address/set/:address_id", auth, updateMainAddress);

router.get("/address/delete/:address_id", auth, deleteAddress);

router.get('/address', auth, sendAddressInfo)

module.exports = router;