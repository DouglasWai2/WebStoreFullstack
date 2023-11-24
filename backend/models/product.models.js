const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  genre: { type: String },
  color: {type: String},
  features: [{ type: String }],
  thumbnail: { type: String, required: true },
  images: [{ type: String, required: true }],
  rating: {type: Number}
});

module.exports = mongoose.model("product", productSchema, "Catalog");
