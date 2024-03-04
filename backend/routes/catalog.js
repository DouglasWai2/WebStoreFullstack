const express = require("express");
const {
  addProduct,
  productsFromStore,
  sendProduct,
  searchResult,
} = require("../controllers/product.controller");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const upload = require("../helpers/upload.helper");

/* ----------------------- upload and error handling ----------------------- */
router.post(
  "/catalog/new-product",
  auth,
  upload.array("files[]", 20),
  addProduct
);
router.get("/catalog/all-products/:storeid", productsFromStore);
router.get("/catalog/product/:productId", sendProduct);
router.get("/catalog/products/search/result", searchResult);

module.exports = router;
