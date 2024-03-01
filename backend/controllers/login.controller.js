const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const setTokens = require("../helpers/setTokens");
const axios = require("axios");

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
  const credentials = req.body;

  try {

    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${credentials.access_token}`,
    );


    user = await UserSchema.findOne({ gid: data.id }); // Search for user by google id
    if (!user) {
      user = await UserSchema.findOne({ email: data.email }); // Check if user has an account if no user has been found by given google id
      if (!user) {
        const newUser = new UserSchema({
          email: data.email,
          name: data.given_name,
          lastName: data.family_name,
          password: Math.random().toString(36).slice(-8),
          confirmedEmail: data.email_verified,
          auth_method: "google",
        });
        await newUser.save(); //Store new user if no account
        user = newUser;
      }
    }

    if (!user.gid) {
      user.gid = data.sub; 
      await user.save(); // Reference google id to user
    }

    return setTokens(res, user);
  } catch (error) {
    console.log(error);
  }
};
