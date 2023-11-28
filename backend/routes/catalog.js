const express = require("express");
const { addProduct } = require("../controllers/product.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require("../helpers/upload.helper");

/* ----------------------- upload and error handling ----------------------- */
router.post(
  "/catalog/new-product/:access_token",
  auth,
  upload.array('files[]', 5),
  addProduct
);

module.exports = router;
