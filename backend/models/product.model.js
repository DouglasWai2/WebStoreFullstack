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
      ref: "Store",
    },
    rating: { type: Number, default: 0.0, min: 0, max: 5 },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sells: { type: Number, default: 0, min: 0 },
    sellsToday: { type: Number, default: 0, min: 0 },
    discount: { type: Number, min: 0, max: 1, default: 0},
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

productSchema.pre('find', function() {
  this._startTime = Date.now();
});

productSchema.post('find', function() {
  if (this._startTime != null) {
    console.log('Product Query Runtime in MS: ', Date.now() - this._startTime);
  }
});

module.exports = mongoose.model("Product", productSchema, "Catalog");
