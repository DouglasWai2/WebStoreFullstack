const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    storeDescription: {
      type: String,
      required: true,
    },
    storeImage: {
      type: String,
    },
    storeCategory: {
      type: String,
      required: true,
    },
    storeBanner: [
      {
        type: String,
      },
    ],
    phone: {
      type: String,
      minlength: 11,
      trim: true,
    },
    cnpj: {
      type: String,
      trim: true,
    },
    cpf: {
      type: String,
      trim: true,
    },
    storeAddress: {
      cep: {
        type: String,
        trim: true,
        maxlength: 8,
      },
      street: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      number: {
        type: String,
        trim: true,
        maxlength: 10,
      },
      neighborhood: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      city: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      state: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categories: [{ type: String }],
    likes: { type: Number },
    melhorEnvios: {
      access_token: { type: String },
      refresh_token: { type: String },
      token_type: { type: String },
      expires_in: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", StoreSchema, "Stores");
