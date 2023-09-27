const UserSchema = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { jwtExpiration,
  jwtRefreshExpiration,
  testjwtExpiration,
  testjwtRefreshExpiration } = require('../utils/expiration')


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
          const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_JWT_TOKEN,
            { expiresIn: testjwtExpiration }
          );
          const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: testjwtRefreshExpiration }
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
