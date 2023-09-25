const UserSchema = require('../models/user.model')

exports.register = async (req, res) => {
    const { username, password, email, phone } = req.body
    if (password.length < 6) {
      return res.status(400).json({ message: "Password less than 6 characters" })
    }
    const newUser = new UserSchema({
      username,
      password,
      email,
      phone
    })
    
    try {   
      await newUser.save()
      res.status(201).send(JSON.stringify(newUser))
    } catch (err) {
      res.status(401).json({
        message: "User not successful created",
        error: err.mesage,
      })
    }
  }