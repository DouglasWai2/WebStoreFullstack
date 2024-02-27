const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.logout = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(200).send("No cookie provided, user already logged out");
  }

  try {
    const loggedOutUser = await UserSchema.findOneAndUpdate(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } },
      { safe: true, upsert: true }
    );
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      })
      .status(200)
      .send("User Logged Out succesfully");
  } catch (error) {
    if (error.code === 2) {
      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 365,
        })
        .status(200)
        .send("User Logged Out succesfully");
    }
  }
};
