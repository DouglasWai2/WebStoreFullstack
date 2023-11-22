const StoreSchema = require("../models/store.model");
const UserSchema = require("../models/user.model");

exports.registerStore = async (req, res) => {
  const { storeName, storeDescription, storeCategory } = req.body;

  const store = new StoreSchema({
    storeName,
    storeDescription,
    storeCategory,
    storeImage: { link: req.file.location, name: req.file.originalname },
    user: req.userInfo.id,
  });

  try {
    await UserSchema.findByIdAndUpdate(req.userInfo.id, { store: store.id });
    await store.save();

    res.status(200).send("Store registered succesfully");
  } catch (error) {
    console.log(error);
  }
};
