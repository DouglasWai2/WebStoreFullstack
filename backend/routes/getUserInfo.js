const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middlewares/verifyToken");
const jwt = require("jsonwebtoken");
require('dotenv').config()

router.get("/:userid/:access_token", auth, async (req, res) => {
  const decoded = jwt.verify(req.params.access_token, process.env.SECRET_JWT_TOKEN)
  const user = await User.findById(req.params.userid);
  if(decoded.id !== user.id){
    return res.status(403).send('Unaccessible data')
  }

  res
    .status(200)
    .json({
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      cpf: user.cpf,
      phone: user.phone,
      birth: user.birth
    })
});

module.exports = router;
