const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    payment_intent: {
      type: String,
    },
    order_number: {
      type: Number,
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
        shipment_status: {
          type: String,
        },
        shipment_track_code: {
          type: String,
        },
        shipment_date: {
          type: Date,
        },
        rated: {
          type: Boolean,
          default: false,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema, "Orders");
