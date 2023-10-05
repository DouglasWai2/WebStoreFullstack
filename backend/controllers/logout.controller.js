const UserSchema = require("../models/user.model");
require("dotenv").config();

exports.logout = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
    if(!refreshToken){
        res.status(200).send('No cookie provided, user already logged out')
    }
  
  const  userId  = req.params.userId;
  try {
    const loggedOutUser = await UserSchema.findByIdAndUpdate(
        userId,
        { $pull: { refreshTokens: refreshToken } },
        { safe: true, upsert: true }
      );  
    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'strict'}).status(200).send('User Logged Out succesfully')
  } catch (error) {
    console.log(error)
  }
 
};