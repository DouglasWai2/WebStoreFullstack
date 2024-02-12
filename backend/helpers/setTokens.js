const UserSchema = require("../models/user.model");
const jwt = require('jsonwebtoken')
const { jwtExpiration, jwtRefreshExpiration } = require("../utils/expiration");
require("dotenv").config();


// Function to create and set access and refresh tokens in response and db respectively
async function setTokens(res, user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_JWT_TOKEN,
    { expiresIn: jwtExpiration }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: jwtRefreshExpiration }
  );

  await UserSchema.updateOne(
    { _id: user._id },
    { $push: { refreshTokens: refreshToken } },
    { new: true }
  );

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    .setHeader("Authorization", accessToken)
    .json({
      authorization: accessToken,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.confirmedEmail,
    });
}

module.exports = setTokens;
