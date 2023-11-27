const productSchema = require("../models/product.models");
const StoreSchema = require('../models/store.model')

exports.addProduct = async (req, res) => {
  const { title, description, brand, model, tags, genre, features } = req.body;

  
  const store = await StoreSchema.find({user: req.userInfo.id})
  console.log(store)
  
  const newProduct = new productSchema({
    title,
    description,
    tags,
    genre,
    brand,
    model,
    features,
    store: store._id
  });
  
  console.log(newProduct)
  if(req.files.length){
    newProduct.thumbnail = req.files[0].location;
    newProduct.images = req.files.map((file) => {
      return file.location;
    });
  }

  try {
    console.log(store)
    await newProduct.save();
    await StoreSchema.findByIdAndUpdate(store.id, {$push: {products: newProduct}})
    res.status(200).send("Product saved successfully");
  } catch (error) {
    console.log(error);
  }
};
