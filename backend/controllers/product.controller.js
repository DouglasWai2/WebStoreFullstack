const productSchema = require("../models/product.model");
const StoreSchema = require("../models/store.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");
const { autoGenerateCategory } = require("../helpers/autoGenerateCategory");

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
    tags,
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
      .select("-legacyCreatedAt -store -updatedAt -createdAt");

    return res.send(product);
  } catch (error) {
    throw new Error(error);
  }
};

exports.allProducts = async (req, res) => {
  const { storeid } = req.params;
  const from = req.query.from;
  const to = parseInt(req.query.to);
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const fromRating = req.query.fromRating;
  const toRating = req.query.toRating;
  const sortBy = req.query.sortby;
  const order = req.query.order;
  const category = req.query.category;
  const title = req.query.title;
  const maxPrice = req.query.maxPrice;
  const minPrice = req.query.minPrice;

  let match = {};

  if (category) {
    match.tags = category;
  }
  if (title) {
    match.title = { $regex: diacriticSensitiveRegex(title), $options: "i" };
  }

  if (fromDate) {
    match.$or = [
      {
        $and: [
          { createdAt: { $gt: fromDate } },
          { createdAt: { $lt: toDate } },
        ],
      },
      {
        $and: [
          { legacyCreatedAt: { $gt: fromDate } },
          { legacyCreatedAt: { $lt: toDate } },
        ],
      },
    ];
  }

  if (fromRating) {
    match.$and = [
      { rating: { $gte: parseFloat(fromRating) } },
      { rating: { $lte: parseFloat(toRating) } },
    ];
  }

  try {
    var { products } = await StoreSchema.findById(storeid).populate({
      path: "products",
      select: "title thumbnail brand price rating sells discount",
      match,
      options: {
        sort: { [sortBy]: order },
        skip: from,
        limit: to,
      },
    });

    return res.status(200).send(products); //res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.productsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await productSchema
      .find({ tags: category })
      .select("title thumbnail brand price rating sells discount")
      .sort({ sells: 1 })
      .limit(20);
      return setTimeout(() => res.status(200).send(products), 1000); //res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};
