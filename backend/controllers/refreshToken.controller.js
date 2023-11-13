const User = require('../models/user.model')
const jwt = require("jsonwebtoken");
require('dotenv').config()
const { jwtExpiration,
  jwtRefreshExpiration,
} = require('../utils/expiration')

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }
  res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'strict'})
  try {
    const foundUser = await User.findOne({refreshTokens: refreshToken}).exec()
    if (!foundUser){
      try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const hackedUser = await User.findByIdAndUpdate(
          user.id,
          { $set: { refreshTokens: [] } },
          { safe: true, upsert: true }
        ); 
      } catch (error) {
        console.log(error)
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
   await User.findByIdAndUpdate(
      decoded.id,
      { $pull: { refreshTokens: refreshToken } },
      { safe: true, upsert: true }
    ); 
    await User.findByIdAndUpdate(
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
    console.log(error)
    return res.status(400).json({message: "Invalid refresh token.", error});
  }
};
