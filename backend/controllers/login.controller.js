const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
const randToken = require("rand-token");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const expiration = {
  jwtExpiration: 900,
  jwtRefreshExpiration: 86400,

  testjwtExpiration: 60, // 1 minute
  testjwtRefreshExpiration: 120, // 2 minutes
};

//
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, error: "missing params" });
    return;
  }

  const { email, password } = req.body;

  UserSchema.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, error: "User does not exist" });
      } else {
        if (!bcrypt.compareSync(password, user.password)) {
          res.status(401).json({ success: false, error: "Wrong password" });
        } else {
          // const token = jwt.sign({id: user._id, email: user.email}, process.env.SECRET_JWT_TOKEN, { expiresIn: 60 })
          // res.status(200).json({ success: true, token: token})
          const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_JWT_TOKEN,
            { expiresIn: expiration.testjwtExpiration }
          );
          const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: expiration.testjwtRefreshExpiration }
          );
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              sameSite: "strict",
            })
            .header("Authorization", accessToken)
            .send(user);
        }
      }
    })
    .catch((err) => {
      res.json({ success: false, err: err });
    });
};
