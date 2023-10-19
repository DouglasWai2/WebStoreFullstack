const express = require("express");
const auth = require('../middlewares/verifyToken')
const {addressController} = require('../controllers/address.controller')
const router = express.Router();


router.post("/address/:userid/:access_token", auth, addressController);

module.exports = router;