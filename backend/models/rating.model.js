const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
  productID: { type: String, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  author: { type: String, required: true },
  images: [{ type: String, required: true }],
  rating: { type: Number },
});

module.exports = mongoose.model("rating", RatingsSchema, "Ratings");
