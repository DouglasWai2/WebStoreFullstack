const mongoose = require("mongoose");
const User = require("./user.model");

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true,
    required: true,
  },
  number: {
    type: String,
    trim: true,
    required: true,
  },
  neighborhood: {
    type: String,
    trim: true,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  state: {
    type: String,
    trim: true,
    required: true,
  },
  country: {
    type: String,
    trim: true,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  main:{
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model("address", AddressSchema, "Adressess");
