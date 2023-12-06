const StoreSchema = require("../models/store.model");
const UserSchema = require("../models/user.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");

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
    await UserSchema.findByIdAndUpdate(req.userInfo.id, {
      store: store.id,
      role: "Seller",
    });
    await store.save();

    res.status(200).send("Store registered succesfully");
  } catch (error) {
    console.log(error);
  }
};

exports.storeInfo = async (req, res) => {
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });
    res.status(200).json({
      storeImage: store.storeImage,
      storeDescription: store.storeDescription,
      storeCategory: store.storeCategory,
      storeName: store.storeName,
      storeAddress: store.storeAddress || "",
      storeId: store.id,
      cpf: store.cpf || undefined,
      cnpj: store.cnpj || undefined,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addStoreAddress = async (req, res) => {
  try {
    const store = await StoreSchema.findOneAndUpdate(
      { user: req.userInfo.id },
      {
        $set: {
          storeAddress: req.body.storeAddress,
        },
      },
      { new: true }
    );
    console.log(store);

    res.status(200).send("Store Address updated");
  } catch (error) {
    console.log(error);
  }
};

exports.setCpfCnpj = async (req, res) => {
  const { cpfcnpj } = req.body;

  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });

    if (cpfcnpj.length === 11) {
      store.cpf = cpfcnpj;
    } else if (cpfcnpj.length === 14) {
      store.cnpj = cpfcnpj;
    } else {
      res
        .status(400)
        .send({
          "Bad Request": "Your id must have 11 for cpf or 14 digits for cnpj",
        });
      return;
    }

    await store.save();
    res.status(200).send("Store id updated");
  } catch (error) {
    console.log(error);
  }
};

exports.changeBanner = async (req, res) => {
  console.log(req);

  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });

    if (!store.storeBanner.link) {
      store.storeBanner.link = req.file.location;
      store.storeBanner.name = req.file.key;
      await store.save();
      res.status(200).send("Banner updated");
    } else {
      try {
        const command = new DeleteObjectCommand({
          Bucket: "webstore-api-images",
          Key: store.storeBanner.name,
        });
        const response = await client.send(command);

        store.storeBanner.link = req.file.location;
        store.storeBanner.name = req.file.key;
        await store.save();
        res.status(200).send("Banner updated");
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
