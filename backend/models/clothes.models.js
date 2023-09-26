const mongoose = require("mongoose");

const clothesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  genre: { type: String, required: true },
  features: [{ type: String }],
  thumbnail: { type: String, required: true },
  images: [{ type: String, required: true }],
});

module.exports = mongoose.model("cloth", clothesSchema, "Clothes");
