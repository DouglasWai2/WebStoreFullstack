const express = require("express");
const { addProduct, allProducts } = require("../controllers/product.controller");
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

router.post("/catalog/all-products/:storeid", allProducts)

module.exports = router;
