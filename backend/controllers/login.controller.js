const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  jwtExpiration,
  jwtRefreshExpiration,
  testjwtExpiration,
  testjwtRefreshExpiration,
} = require("../utils/expiration");

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
      res.status(401).json({ success: false, error: "User does not exist" });
    } else {
      if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ success: false, error: "Wrong password" });
      } else {
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
        try{
          const newUserToken = await UserSchema.updateOne(
            { _id: user._id },
            { $push: { refreshTokens: refreshToken } },
            { new: true }
          );
        }catch(error){
          return res.status(400).json({error, message: 'Unable to reach database' })
        }

        
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge : 1 * 1000 * 60 * 60 * 24 * 365
          })
          .header("Authorization", accessToken)
          .json({
            authorization: accessToken,
            userId: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.confirmedEmail,
          });
      }
    }
  } catch (err) {
    res.json({ success: false, err: err });
  }
};
