const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
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
    link: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
  },
  storeCategory: {
    type: String,
    required: true,
  },
  storeBanner:{
    link: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
  },
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
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

module.exports = mongoose.model("Store", StoreSchema, "Stores");
