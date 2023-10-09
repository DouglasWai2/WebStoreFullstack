const User = require('../models/user.model')
const jwt = require("jsonwebtoken");
require('dotenv').config()
const { jwtExpiration,
  jwtRefreshExpiration,
  testjwtExpiration,
  testjwtRefreshExpiration } = require('../utils/expiration')

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }
  res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'strict'})
  try {
    const foundUser = await User.findOne({refreshTokens: refreshToken}).exec()
    if (!foundUser){
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      try {
        const hackedUser = await User.finedOne({id: user.id}).exec()
        hackedUser.refreshToken = [];
        const result = await hackedUser.save()
      } catch (error) {
        return res.status(403).send(
          error
        )
      } 
  }
  } catch (error) {
    console.log(error)
  }
  
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const newRefreshToken = jwt.sign(
    { id: decoded.id, email: decoded.email },
    `${process.env.REFRESH_TOKEN_SECRET}`,
    { expiresIn: jwtRefreshExpiration }
  );
  const accessToken = jwt.sign(
    { id: decoded.id, email: decoded.email },
    `${process.env.SECRET_JWT_TOKEN}`,
    { expiresIn: jwtExpiration }
  );
  
  try { 
    const newUser = await User.findByIdAndUpdate(
      decoded.id,
      { $pull: { refreshTokens: refreshToken } },
      { safe: true, upsert: true }
    ); 
    const newUserToken = await User.findByIdAndUpdate(
        decoded.id ,
      { $push: { refreshTokens: newRefreshToken } },
      { new: true }
    );

    res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .header("Authorization", accessToken)
    .json({
      accessToken
    });
  } catch (error) { 
    return res.status(400).send("Invalid refresh token.");
  }
};
