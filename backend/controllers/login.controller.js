const UserSchema = require('../models/user.model')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken');

exports.login = (req, res) =>{
    if(!req.body.email || !req.body.password){
        res.json({success: false, error: "missing params"})
        return
    }

    const { email, password } = req.body

    UserSchema.findOne({email: email}).then((user) => {
        console.log(user)
        if(!user){
            res.status(401).json({success: false, error: "User does not exist"})
        } else{
            if(!bcrypt.compareSync(password, user.password)){
                res.status(401).json({success: false, error: "Wrong password"})
            } else{
                const token = jwt.sign({ id: user._id, email: user.email}, process.env.SECRET_JWT_TOKEN)
                res.status(200).json({ success: true, token: token})
            }
        }
    })
    .catch(err => {
        res.json({success: false, err: err})
    })
    
        

}