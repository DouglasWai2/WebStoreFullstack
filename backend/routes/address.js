const express = require("express");
const auth = require('../middlewares/verifyToken')
const {addressController, sendAddressInfo} = require('../controllers/address.controller')
const router = express.Router();


router.post("/address/:userid/:access_token", auth, addressController);

router.get('/address/:userid/:access_token', auth, sendAddressInfo)

module.exports = router;