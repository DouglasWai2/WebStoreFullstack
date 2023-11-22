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
  phone: {
    type: String,
    minlength: 11,
    unique: true,
    trim: true,
  },
  CNPJ: {
    type: String,
    unique: true,
    trim: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("store", StoreSchema, "stores");
