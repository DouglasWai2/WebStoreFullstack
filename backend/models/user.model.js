const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Address = require("./address.model");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
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
  address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      }],
  role: {
    type: String,
    default: "Costumer",
    required: true,
  },
  confirmedEmail: {
    type: Boolean,
    default: false,
  },
  refreshTokens: {
    type: [String],
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("user", UserSchema, "Users");
