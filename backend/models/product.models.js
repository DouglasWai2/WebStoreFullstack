const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    tags: [{ type: String, required: true }],
    genre: { type: String },
    color: { type: String },
    features: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
    },
    rating: { type: Number, default: 0.0, min: 0, max: 5 },
    sells: { type: Number, default: 0, min: 0 },
    discount: { type: Number, min: 0, max: 1 },
    dimensions: {
      weight: { type: Number, required: true },
      height: { type: Number, required: true },
      length: { type: Number, required: true },
      width: { type: Number, required: true },
    },
    legacyCreatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema, "Catalog");
