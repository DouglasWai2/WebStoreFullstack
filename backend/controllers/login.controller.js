const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
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
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    user = await UserSchema.findOne({ gid: payload.sub }); // Search for user by google id
    if (!user) {
      user = await UserSchema.findOne({ email: payload.email }); // Check if user has an account
      if (!user) {
        const newUser = new UserSchema({
          email: payload.email,
          name: payload.given_name,
          lastName: payload.family_name,
          password: Math.random().toString(36).slice(-8),
          confirmedEmail: payload.email_verified,
          auth_method: "google",
        });
        await newUser.save(); //Store new user if no account
        user = newUser;
      }
    }

    if (!user.gid) {
      user.gid = payload.sub; // Reference google id to user
      await user.save();
    }

    return setTokens(res, user);
  } catch (error) {
    console.log(error);
  }
};
