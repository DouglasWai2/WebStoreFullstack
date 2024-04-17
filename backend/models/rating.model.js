const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String}],
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("rating", RatingsSchema, "Ratings");
