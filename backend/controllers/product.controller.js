const productSchema = require("../models/product.models");
const StoreSchema = require('../models/store.model')

exports.addProduct = async (req, res) => {
  const { title, description, brand, model, tags, genre, features } = req.body;

  const newProduct = new productSchema({
    title,
    description,
    tags,
    genre,
    brand,
    model,
    features,
  });
  if(req.files.length){
    newProduct.thumbnail = req.files[0].location;
    newProduct.images = req.files.map((file) => {
      return file.location;
    });
  }

  try {
    const store = await StoreSchema.findOneAndUpdate({user: req.userInfo.id}, {$push: {products: newProduct}})
    newProduct.store = store.id
    await newProduct.save();
    res.status(200).send("Product saved successfully");
  } catch (error) {
    console.log(error);
  }
};
