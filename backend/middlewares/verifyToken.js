const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  const accessToken = req.params.access_token;
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken)
    return res.status(401).send("Access Denied. No token provided.");
  if (!accessToken) return res.status(401).send("Unauthorized");

  // If there's no user from given refresh token, token is already deleted (user could been hacked)
  const foundUser = await UserSchema.findOne({ refreshTokens: refreshToken });
  if (!foundUser) return res.status(403).send("Invalid Refresh Token");

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
