const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  cep: {
    type: String,
    trim: true,
    required: true,
    length: 9,
  },
  street: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  number: {
    type: String,
    trim: true,
    required: true,
    maxlength: 10,
  },
  neighborhood: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  city: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  state: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  CPF: {
    type: String,
    trim: true,
    required: true,
    length: 14,
  },
  nickname: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  recieverName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 100,
  },
  country: {
    type: String,
    trim: true,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  main: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("address", AddressSchema, "Adressess");
