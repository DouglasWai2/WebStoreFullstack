const express = require("express");
const { addProduct, allProducts, sendProduct, productsByCategory, mostSelledProducts} = require("../controllers/product.controller");
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

router.get("/catalog/all-products/:storeid", allProducts)
router.get("/catalog/:productId", sendProduct)
router.get("/catalog/category/:category", productsByCategory)
router.get("/catalog", mostSelledProducts)

module.exports = router;
