const diacriticSensitiveRegex = require("../helpers/diacriticSensitiveRegex");
const productModel = require("../models/product.model");
const storeModel = require("../models/store.model");

exports.search = async (req, res) => {
  const { search } = req.query;

  try {
    const products = await productModel
      .find({
        $or: [
          { title: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
          { tags: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
        ],
      })
      .select("title thumbnail");

    const stores = await storeModel
      .find({
        storeName: { $regex: diacriticSensitiveRegex(search), $options: "i" },
      })
      .select("storeName storeImage");
 c
    return res.status(200).json({ products, stores });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
