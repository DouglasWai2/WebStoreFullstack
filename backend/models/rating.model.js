const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
  productID: { type: String, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  user: { type: String, required: true },
  images: [{ type: String}],
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("rating", RatingsSchema, "Ratings");
