const UserSchema = require("../models/user.model");
const AddressSchema = require("../models/address.model");

exports.addressController = async (req, res) => {
  const {
    cep,
    street,
    number,
    neighborhood,
    city,
    CPF,
    recieverName,
    nickname,
    state,
    country,
  } = req.body.address;

  const userid = req.userInfo.id;

  const newAddress = new AddressSchema({
    cep,
    street,
    number,
    neighborhood,
    city,
    state,
    CPF,
    recieverName,
    nickname,
    country,
    user: userid,
  });

  try {
    const user = await UserSchema.find({ _id: userid }, { address: 1 });
    if (user[0].address.length === 0) {
      newAddress.main = true;
    }
    await newAddress.save();
    await UserSchema.findByIdAndUpdate(userid, {
      $push: { address: newAddress },
    });
    res.status(200).send("Address saved successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad request", error });
  }
};

exports.sendAddressInfo = async (req, res) => {
  const userid = req.userInfo.id;
  const user = await UserSchema.findById(userid).populate("address");

  const { address } = user;
  const modifiedAddress = address.map((item) => {
    const {
      id,
      cep,
      street,
      number,
      neighborhood,
      city,
      CPF,
      recieverName,
      nickname,
      state,
      country,
      main,
    } = item;

    let lastCPFDigits = CPF.toString().slice(7, 11);


    return {
      id,
      cep,
      street,
      number,
      neighborhood,
      city,
      CPF: "******" + lastCPFDigits,
      recieverName,
      nickname,
      state,
      country,
      main,
    };
  });

  try {
    res.status(200).send(modifiedAddress);
  } catch (error) {
    console.log(error);
  }
};

exports.updateMainAddress = async (req, res) => {
  const addressId = req.params.address_id;
  const userId = req.userInfo.id;
  try {
    const foundUserAddressess = await AddressSchema.findOneAndUpdate(
      { user: userId, main: true },
      { main: false }
    );
    const alteredAddress = await AddressSchema.findOneAndUpdate(
      { _id: addressId },
      { main: true }
    );
    res.status(200).send("Main address altered successfully");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAddress = async (req, res) => {
  const addressId = req.params.address_id;
  const userId = req.userInfo.id;
  try {
    await UserSchema.findByIdAndUpdate(userId, {
      $pull: { address: { $in: [addressId] } },
    });
    const alteredAddress = await AddressSchema.findByIdAndDelete(addressId);
    res.status(200).send("Address deleted successfully");
  } catch (error) {
    console.log(error);
  }
};
