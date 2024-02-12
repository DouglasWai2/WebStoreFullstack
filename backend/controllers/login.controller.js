const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { jwtExpiration, jwtRefreshExpiration } = require("../utils/expiration");
const setTokens = require("../helpers/setTokens");

//
exports.login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, error: "missing params" });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exist" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ success: false, error: "Wrong password" });
    }
    return setTokens(res, user);
  } catch (err) {
    return res.status(400).json({ success: false, err: err });
  }
};

exports.googleAuth = async (req, res) => {
  let user;
  const { credential } = req.body;
  const decoded = jwt.decode(credential);

  try {
    user = await UserSchema.findOne({ email: decoded.email });
    if (!user) {
      const newUser = new UserSchema({
        email: decoded.email,
        name: decoded.given_name,
        lastName: decoded.family_name,
        password: Math.random().toString(36).slice(-8),
        confirmedEmail: decoded.email_verified,
        auth_method: "google",
      });
      await newUser.save();

      user = newUser;
    }

    return setTokens(res, user);
  } catch (error) {
    console.log(error);
  }
};
