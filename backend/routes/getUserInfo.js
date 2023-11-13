const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middlewares/verifyToken");
require('dotenv').config()

router.get("/:access_token", auth, async (req, res) => {
  const user = await User.findById(req.userInfo.id);

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
