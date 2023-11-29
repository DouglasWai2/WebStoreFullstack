const productSchema = require("../models/product.models");
const StoreSchema = require("../models/store.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");

exports.addProduct = async (req, res) => {
  const { title, description, brand, model, tags, genre, features } = req.body;

  console.log(req.files);

  const newProduct = new productSchema({
    title,
    description,
    tags,
    genre,
    brand,
    model,
    features,
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
    await newProduct.save().then((response) => {
      store.products.push(newProduct.id);
      store.save();
    });

    res.status(200).send("Product saved successfully");
  } catch (error) {
    console.log(error);
    req.files.map(async (file) => {
      const command = new DeleteObjectCommand({
        Bucket: "webstore-api-images",
        Key: file.key,
      });
      const response = await client.send(command);
    });
  }
};
