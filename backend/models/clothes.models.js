const mongoose = require("mongoose");

const clothesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  genre: { type: String },
  features: [{ type: String }],
  thumbnail: { type: String, required: true },
  images: [{ type: String, required: true }],
  rating: {type: Number}
});

module.exports = mongoose.model("cloth", clothesSchema, "Clothes");
