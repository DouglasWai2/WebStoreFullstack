const express = require("express");
const { addProduct } = require("../controllers/product.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require("../helpers/upload.helper");

/* ----------------------- upload and error handling ----------------------- */
router.post(
  "/catalog/new-product",
  auth,
  upload.array('files[]', 20),
  addProduct
);

module.exports = router;
