const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StoreSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    minlength: 6,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    minlength: 11,
    required: true,
    unique: true,
    trim: true,
  },
  CNPJ: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    default: "Store",
    required: true,
  },
});

StoreSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("store", StoreSchema, "stores");
