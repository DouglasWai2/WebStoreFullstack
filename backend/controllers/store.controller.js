const StoreSchema = require("../models/store.model");
const UserSchema = require("../models/user.model");
const productSchema = require("../models/product.models");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");
const { autoGenerateCategory } = require("../helpers/autoGenerateCategory");
const diacriticSensitiveRegex = require("../helpers/diacriticSensitiveRegex");

exports.registerStore = async (req, res) => {
  const { storeName, storeDescription, storeCategory } = req.body;

  const store = new StoreSchema({
    storeName,
    storeDescription,
    storeCategory,
    storeImage: req.file.location,
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
  const storeId = req.userInfo?.id || req.params.storeid;

  try {
    const store = await StoreSchema.findOne(
      {
        $or: [
          { user: storeId },
          { $and: [{ _id: storeId }, { storeName: req.params.storename }] },
        ],
      },
      "storeImage storeDescription storeName storeAddress storeId cpf cnpj storeBanner products categories likes"
    );

    if (!store) {
      res.status(404).send("No store found, wrong link!");
    } else {
      return res.status(200).json(store);
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).send("Broken link");
    }
  }
};

exports.addStoreAddress = async (req, res) => {
  console.log(req.body);
  try {
    const store = await StoreSchema.findOneAndUpdate(
      { user: req.userInfo.id },
      {
        $set: {
          storeAddress: req.body.address,
        },
      },
      { new: true }
    );

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
      res.status(400).send({
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

exports.changeBanner = async ({ req, res }) => {
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });

    if (store.storeBanner.length === 0) {
      store.storeBanner = req.files.map((item) => item.location);
      await store.save();
      res.status(200).send("Banner updated");
    } else {
      try {
        if (!req.files.length) return;
        const regex = /([^/]+(\.\w+))$/;
        store.storeBanner.forEach(async (item) => {
          const match = item.match(regex);

          const command = new DeleteObjectCommand({
            Bucket: "webstore-api-images",
            Key: match[0],
          });
          const response = await client.send(command);
        });
        const array = req.files.map((item) => item.location);
        store.storeBanner = array;
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
exports.changeImage = async (req, res) => {
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });

    if (!store.storeImage) {
      store.storeImage = req.file.location;
      await store.save();
      res.status(200).send("Banner updated");
    } else {
      try {
        if (!req.file) return;
        const regex = /([^/]+(\.\w+))$/;
        const match = store.storeImage.match(regex);
        const command = new DeleteObjectCommand({
          Bucket: "webstore-api-images",
          Key: match[0],
        });
        const response = await client.send(command);

        store.storeImage = req.file.location;
        await store.save();
        res.status(200).send("Store logo updated");
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.myProducts = async (req, res) => {
  const userId = req.userInfo.id;
  const from = req.query.from;
  const to = parseInt(req.query.to);
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const fromRating = req.query.fromRating;
  const toRating = req.query.toRating;
  const sortBy = req.query.sortby;
  const order = req.query.order;
  const category = req.query.category;
  const title = req.query.title;
  const maxPrice = req.query.maxPrice;
  const minPrice = req.query.minPrice;

  let match = {};

  if (category) {
    match.tags = category;
  }
  if (title) {
    match.title = { $regex: diacriticSensitiveRegex(title), $options: "i" };
  }

  if (fromDate) {
    match.$or = [
      {
        $and: [
          { createdAt: { $gt: fromDate } },
          { createdAt: { $lt: toDate } },
        ],
      },
      {
        $and: [
          { legacyCreatedAt: { $gt: fromDate } },
          { legacyCreatedAt: { $lt: toDate } },
        ],
      },
    ];
  }

  if (fromRating) {
    match.$and = [
      { rating: { $gte: parseFloat(fromRating) } },
      { rating: { $lte: parseFloat(toRating) } },
    ];
  }

  try {
    var { products } = await StoreSchema.findOne({ user: userId }).populate({
      path: "products",
      select: "title thumbnail brand price rating sells discount",
      match,
      options: {
        sort: { [sortBy]: order },
        skip: from,
        limit: to,
      },
    });

    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProducts = async (req, res) => {
  const { productIDs } = req.body;

  if (!Array.isArray(productIDs)) return res.status(400).send("No id provided");

  productIDs.forEach(async (item) => {
    try {
      const store = await StoreSchema.findOneAndUpdate(
        { user: req.userInfo.id },
        { $pull: { products: item } }
      );
      const product = await productSchema.findById(item);
      product.images.forEach(async (item) => {
        const regex = /([^/]+(\.\w+))$/;
        const match = item.match(regex);
        try {
          const command = new DeleteObjectCommand({
            Bucket: "webstore-api-images",
            Key: match[0],
          });
          const response = await client.send(command);
        } catch (error) {
          console.log(error);
        }
      });
      await productSchema.findByIdAndDelete(product.id);
      store.categories = await autoGenerateCategory(store.id);
      await store.save();
    } catch (error) {
      return console.log(error);
    }
  });

  return res.status(200).send("Products deleted successfully");
};

exports.discountProducts = async (req, res) => {
  const { productIDs } = req.body;
  const { discount } = req.body;

  if (!Array.isArray(productIDs)) return res.status(400).send("No id provided");

  try {
    productIDs.forEach(async (item) => {
      await productSchema.findByIdAndUpdate(item, { discount });
    });

    return res.status(200).send("Discount added");
  } catch (error) {
    console.log(error);
  }
};
