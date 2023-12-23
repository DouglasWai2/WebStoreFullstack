const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String},
  model: { type: String},
  tags: [{ type: String, required: true }],
  genre: { type: String },
  color: {type: String},
  features: [{ type: String }],
  thumbnail: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stores",
  },
  rating: {type: Number}
});

module.exports = mongoose.model("Product", productSchema, "Catalog");
