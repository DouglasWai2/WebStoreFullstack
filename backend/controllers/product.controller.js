const productSchema = require("../models/product.models");
const StoreSchema = require("../models/store.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");
const { autoGenerateCategory } = require("../helpers/autoGenerateCategory");

exports.addProduct = async (req, res) => {
  const { title, description, brand, model, tags, genre, features, price } =
    req.body;

    console.log(req.body)
  const newProduct = new productSchema({
    title,
    description,
    tags,
    genre,
    brand,
    model,
    features,
    price,
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
    await store.save();
    store.categories = await autoGenerateCategory(store.id);
    await store.save();
    return res.status(200).send("Product saved successfully");
    } catch (error) {
    console.log(error);
    req.files.map(async (file) => {
      const command = new DeleteObjectCommand({
        Bucket: "webstore-api-images",
        Key: file.key,
      });
      const response = await client.send(command);
    });
    return res.status(400).send(error)
  }
};

exports.allProducts = async (req, res) => {
  const storeId = req.params.storeid;
  const from = req.query.from;
  const to = parseInt(req.query.to);
  const sortBy = req.query.sortby;
  const order = req.query.order;

  try {
    var { products } = await StoreSchema.findById(storeId).populate(
      "products",
      "title thumbnail brand price rating sells -_id",
      null,
      { sort: { [sortBy]: order }, skip: from, limit: to }
    );

    return res.status(200).send(products)
  } catch (error) {
    console.log(error);
  }
};
