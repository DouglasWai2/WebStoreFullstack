const UserSchema = require("../models/user.model");
const AddressSchema = require("../models/address.model");
const StoreSchema = require("../models/store.model");

exports.sendUserInfo = async (req, res) => {
  const user = await UserSchema.findById(req.userInfo.id).populate("address");

  res.status(200).json({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    cpf: user.cpf,
    phone: user.phone,
    birth: user.birth,
    role: user.role,
    saved_stores: user.saved_stores,
    addressess: user.address,
  });
};

exports.updateUserData = async (req, res) => {
  const data = req.body;
  const user = await UserSchema.findById(req.userInfo.id);

  data.map((item) => {
    if (Object.values(item)[0]) {
      user[item.value] = Object.values(item)[0];
    }
  });

  try {
    await user.save();
    res.status(200).send("User data updated");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.likeStore = async (req, res) => {
  const { storeId } = req.body;
  const user = req.userInfo.id;

  try {
    const { saved_stores } = await UserSchema.findById(user);
    if (saved_stores.indexOf(storeId) >= 0) {
      await UserSchema.findByIdAndUpdate(user, {
        $pull: { saved_stores: storeId },
      }).catch((err) => console.log(err));
      await StoreSchema.findByIdAndUpdate(storeId, {
        $inc: { likes: -1 },
      }).catch((err) => console.log(err));
      return res.status(200).send("store unliked successfully");
    } else {
      await UserSchema.findByIdAndUpdate(user, {
        $push: { saved_stores: storeId },
      }).catch((err) => console.log(err));
      await StoreSchema.findByIdAndUpdate(storeId, {
        $inc: { likes: 1 },
      }).catch((err) => console.log(err));
      return res.status(200).send("store liked successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.saveAddress = async (req, res) => {
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
