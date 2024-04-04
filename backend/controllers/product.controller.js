const productSchema = require("../models/product.model");
const StoreSchema = require("../models/store.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const diacriticSensitiveRegex = require("../helpers/diacriticSensitiveRegex");
const applyFilters = require("../helpers/applyFilters");
const client = require("../utils/s3.util");
const { autoGenerateCategory } = require("../helpers/autoGenerateCategory");
const capitalizeFirstLetter = require("../helpers/capitalizeFirstLetter");

exports.addProduct = async (req, res) => {
  const {
    title,
    description,
    brand,
    model,
    tags,
    genre,
    features,
    price,
    dimensions,
  } = req.body;

  const newProduct = new productSchema({
    title,
    description,
    genre,
    brand,
    model,
    features,
    price,
    dimensions,
  });
  if (req.files.length) {
    newProduct.thumbnail = req.files[0].location;
    newProduct.images = req.files.map((file) => {
      return file.location;
    });
  }

  newProduct.tags = tags.map((tag) => {
    return capitalizeFirstLetter(tag);
  });

  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });
    newProduct.store = store.id;
    await newProduct.save();
    store.products.push(newProduct.id);
    store.categories = await autoGenerateCategory(store.id);
    await store.save();
    return res.status(200).send("Product saved successfully");
  } catch (error) {
    console.log(error);
    req.files.forEach((file) => {
      const command = new DeleteObjectCommand({
        Bucket: "webstore-api-images",
        Key: file.key,
      });
      client.send(command);
    });
    return res.status(400).send(error);
  }
};

exports.sendProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productSchema
      .findById(productId)
      .select("-legacyCreatedAt -store -updatedAt -createdAt")
      .populate("store", "storeName storeImage likes");

    return res.send(product);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.productsFromStore = async (req, res) => {
  const { storeid } = req.params;

  const { match, options } = applyFilters(req.query);

  try {
    var { products } = await StoreSchema.findById(storeid).populate({
      path: "products",
      select: "title thumbnail brand price rating sells discount",
      match,
      options,
    });

    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.searchResult = async (req, res) => {
  const { match, options } = applyFilters(req.query);
  const { page } = req.query || 1;

  try {
    const products = await productSchema
      .find(match)
      .sort(options.sort)
      .select("title thumbnail price rating sells discount")
      .skip((page - 1) * 30)
      .limit(30);

    const countQuery = await productSchema.where(match).countDocuments();

    return res.status(200).send({ products, countQuery });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.mostSelledProducts = async (req, res) => {
  try {
    const products = await productSchema
      .find()
      .sort({ sellsToday: -1 })
      .select("title thumbnail brand price rating sells discount")
      .limit(20);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.resetSellsToday = async () => {
  try {
    const products = await productSchema.updateMany(
      { sellsToday: { $gt: 0 } },
      { $set: { sellsToday: 0 } }
    );

    console.log("Sells today reseted");
  } catch (error) {
    console.log(error);
  }
};
