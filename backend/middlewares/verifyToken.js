const jwt = require("jsonwebtoken");
require("dotenv").config();
const { jwtExpiration,
  jwtRefreshExpiration,
  testjwtExpiration,
  testjwtRefreshExpiration } = require('../utils/expiration');
const UserSchema = require("../models/user.model");


const verifyToken = async (req, res, next) => {
  const accessToken = req.params.access_token;
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) return res.status(401).send("Access Denied. No token provided.");

  const foundUser = await UserSchema.findOne({refreshTokens: refreshToken})
  if(!foundUser) return res.status(403).send('Invalid Refresh Token')
    
  
  try {
    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const decoded = jwt.verify(accessToken, process.env.SECRET_JWT_TOKEN);
    req.userInfo = decoded
    next()
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = verifyToken;
