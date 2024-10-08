const UserSchema = require("../models/user.model");
const Token = require("../models/token.model");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
require("dotenv").config;

exports.register = async (req, res) => {
  const { name, lastName, email, phone, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  const newUser = new UserSchema({
    name,
    lastName,
    email,
    phone,
    password,
  });

  const token = new Token({
    userId: newUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  });

  const message = `<p>Este é seu e-mail de verificação, não compartilhe com ninguem:</p> 
  <a href="${process.env.ORIGIN}/register/user/verify?id=${newUser.id}&token=${token.token}">Clique aqui para verificar</a>`;
  try {
    await sendEmail(newUser.email, "Verifique sua conta WebStore", message);
    await newUser.save();
    await token.save();

    return res
      .status(201)
      .send(
        JSON.stringify(newUser, {
          message: "An Email sent to your account please verify",
        })
      );
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({
        message: "already registered",
        err: err.keyPattern,
      });
    } else {
      res.status(401).json({
        message: "User not successful created",
        error: err,
      });
    }
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await UserSchema.findOneAndUpdate(
      { _id: user._id },
      { confirmedEmail: true },
      { new: true }
    );
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully")
  } catch (error) {
    res.status(400).send(error);
  }
};
