const UserSchema = require("../models/user.model");
const AddressSchema = require('../models/address.model')

exports.addressController = async (req, res) => {
    const {cep,
    street,
    number,
    neighborhood,
    city,
    state,
    country } = req.body.address

    const userid = req.params.userid

    const newAddress = new AddressSchema({
        cep,
        street,
        number,
        neighborhood,
        city,
        state,
        country,
        user: userid
    })

    try {
        const addressess = await UserSchema.find({_id: userid}, {addressess: 1})
            if(addressess[0].addressess.length === 0){
                newAddress.main = true
            }
        await newAddress.save()
        await UserSchema.findByIdAndUpdate(userid, {$push: {addressess: newAddress}})
        res.status(200).send('Address saved successfully')
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Bad request', error})
    }  
}

exports.sendAddressInfo = async (req, res) => {
    const userid = req.params.userid
    const addressess = await UserSchema.find({_id: userid}, {addressess: 1})
    res.status(200).send(addressess)

}