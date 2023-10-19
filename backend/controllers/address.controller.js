const UserSchema = require("../models/user.model");

exports.addressController = async (req, res) => {
    const { address } = req.body
    try {
        await UserSchema.findOneAndUpdate({_id: req.params.userid}, {$push: { address: address} }, {new: true});
        res.status(200).send('address saved successfully')
    } catch (error) {
        console.log(error)
    }  
}