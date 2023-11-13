const mongoose = require("mongoose");
const User = require("./user.model");

const AddressSchema = new mongoose.Schema({
  cep: {
    type: String,
    trim: true,
    required: true,
  },
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
  CPF: {
    type: String,
    trim: true,
    required: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  recieverName: {
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
