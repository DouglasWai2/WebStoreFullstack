const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middlewares/verifyToken");
require('dotenv').config()

router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.userInfo.id);
  console.log('teste')
  
  res
    .status(200)
    .json({
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      cpf: user.cpf,
      phone: user.phone,
      birth: user.birth,
      role: user.role
    })
});

router.post("/user/update", auth, async(req, res) => {
  const data = req.body
  const user = await User.findById(req.userInfo.id)

  data.map(item => {
    if(Object.values(item)[0]){
      user[item.value] = Object.values(item)[0]
    } 
  })

  try {
    await user.save()
    res.status(200).send('User data updated')
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }

})

module.exports = router;
