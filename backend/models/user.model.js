const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  auth_method: { type: String },
  email: {
    type: String,
    minlength: 6,
    required: true,
    unique: true,
    trim: true,
  },
  cpf: {
    type: String,
    minlength: 11,
    trim: true,
  },
  birth: {
    type: Date,
    offset: {
      type: String,
    },
  },
  phone: {
    type: String,
    minlength: 11,
    unique: true,
    trim: true,
  },
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  ],
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
  customerId: {
    type: String,
  },
  gid: { type: String },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "store",
  },
  saved_stores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "store",
  }],
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

module.exports = mongoose.model("user", UserSchema, "Users");
