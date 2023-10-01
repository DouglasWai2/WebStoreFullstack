const UserSchema = require("../models/user.model");

exports.register = async (req, res) => {
  const { name, lastName, email, phone, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  const newUser = new UserSchema({
    name,
    lastName,
    email,
    phone,
    password,
  });

  try {
    await newUser.save();
    res.status(201).send(JSON.stringify(newUser));
  } catch (err) {
    if(err.code === 11000){
      res.status(400).json({
        message: 'already registered',
        err: err.keyPattern
      })
    }else{
      res.status(401).json({
        message: "User not successful created",
        error: err.mesage,
      });
    }
    }   
};
