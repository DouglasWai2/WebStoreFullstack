const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = require("../models/user.model");

const verifyToken = async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized");
  }

  if (!req.cookies["refreshToken"]) {
    return res.status(403).send("Access Denied. No token provided.");
  }

  const accessToken = req.headers.authorization.split(" ")[1];
  const refreshToken = req.cookies["refreshToken"];

  // If there's no user from given refresh token, token is already deleted (user could been hacked)
  try {
    const foundUser = await UserSchema.findOne({ refreshTokens: refreshToken });
    if (!foundUser) return;
  } catch (error) {
    console.log(error)
    return res.status(403).send("Invalid refresh token");

  }

  try {

    const refreshDecoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET

    );
    try {

      const decoded = jwt.verify(accessToken, process.env.SECRET_JWT_TOKEN);
      req.userInfo = decoded;
      next();

    } catch (error) {

      console.log(error);
      return res.status(401).send("Expired access token");

    }
  } catch (err) {

    console.log(err);
    return res.status(401).send("Expired refresh token");

  }
};

module.exports = verifyToken;
