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
  cnpj: {
    type: String,
    unique: true,
    trim: true,
  },
  cpf: {
    type: String,
    unique: true,
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
      required: true,
      maxlength: 100
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100
    },
    country: {
      type: String,
      trim: true,
    }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("store", StoreSchema, "stores");
