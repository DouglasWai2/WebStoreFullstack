const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
   status:{ type: String, required: true },
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true,
   },
  items: [
    {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
            required: true,
          },
          currentPrice: {
            type: Number,
            default: 1,
            required: true,
          },
          currentDiscount: {
            type: Number,
            default: 1,
            required: true,
          },
        },
      ],
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
      shipment: {
        type: Object,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema, "Orders");
