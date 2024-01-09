const UserSchema = require("../models/user.model");
const Token = require("../models/token.model");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY)
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

  const customer = await stripe.customers.create();

  const {id} = customer
  newUser.customerId = id
  const message = `Este é seu e-mail de verificação, não compartilhe com ninguem: 
  http://localhost:5000/auth/register/user/verify/${newUser.id}/${token.token}`;
  try {
    await newUser.save();
    await token.save();
    await sendEmail(newUser.email, "Verify Email", message);
    res
      .status(201)
      .send(
        JSON.stringify(newUser, 
          {message: "An Email sent to your account please verify",}
        )
      );
  } catch (err) {
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

    await UserSchema.findOneAndUpdate({_id: user._id}, { confirmedEmail: true }, {new: true});
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send(error);
  }
}
