const StoreSchema = require("../models/store.model");
const UserSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
const OrderSchema = require("../models/order.model");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = require("../utils/s3.util");
const { autoGenerateCategory } = require("../helpers/autoGenerateCategory");
const applyFilters = require("../helpers/applyFilters");
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
    let store = await StoreSchema.findOne(
      {
        $or: [
          { user: storeId },
          { $and: [{ _id: storeId }, { storeName: req.params.storename }] },
        ],
      },
      "storeImage storeDescription storeName storeAddress storeId products cpf cnpj storeBanner categories likes"
    );

    if (!store) {
      return res.status(404).send("No store found, wrong link!");
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
  const { cep, street, number, neighborhood, city, state } = req.body.address;

  if (!cep || !street || !number || !neighborhood || !city || !state) {
    return res.status(400).send("Missing address data");
  }

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
      return res.status(400).send({
        "Bad Request": "Your id must have 11 for cpf or 14 digits for cnpj",
      });
    }

    await store.save();
    return res.status(200).send("Store id updated");
  } catch (error) {
    console.log(error);
  }
};

exports.changeBanner = async (req, res) => {
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id });

    if (store.storeBanner.length === 0) {
      store.storeBanner = req.files.map((item) => item.location);
      await store.save();
      return res.status(200).send("Banner updated");
    } else {
      try {
        if (!req.files.length) return;
        const regex = /([^/]+(\.\w+))$/;
        store.storeBanner.forEach((item) => {
          const match = item.match(regex);

          const command = new DeleteObjectCommand({
            Bucket: "webstore-api-images",
            Key: match[0],
          });
          client.send(command);
        });
        const array = req.files.map((item) => item.location);
        store.storeBanner = array;

        await store.save();

        return res.status(200).send("Banner updated");
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
        client.send(command);

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
  const { match, options } = applyFilters(req.query);

  try {
    var { products } = await StoreSchema.findOne({ user: userId }).populate({
      path: "products",
      select: "title thumbnail brand price rating sells discount",
      match,
      options,
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
          client.send(command);
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

exports.getCarouselImages = async (req, res) => {
  const { storeInterests } = req.body;
  const { interest } = req.body;
  const carouselImages = new Set();
  const storeInfo = [];

  try {
    await Promise.all(
      storeInterests.map(async (storeInterest) => {
        const stores = await StoreSchema.find({ storeCategory: storeInterest })
          .sort({
            likes: -1,
          })
          .limit(3);

        stores.forEach((store) => {
          if (
            store.storeBanner[0] &&
            !carouselImages.has(store.storeBanner[0])
          ) {
            carouselImages.add(store.storeBanner[0]);
            storeInfo.push({
              name: store.storeName,
              image: store.storeImage,
              id: store._id,
            });
          }
        });
      })
    );

    await Promise.all(
      interest.map(async (interest) => {
        const stores = await StoreSchema.find({ categories: interest })
          .sort({
            likes: -1,
          })
          .limit(3);

        stores.forEach((store) => {
          if (
            store.storeBanner[0] &&
            !carouselImages.has(store.storeBanner[0])
          ) {
            carouselImages.add(store.storeBanner[0]);
            storeInfo.push({
              name: store.storeName,
              image: store.storeImage,
              id: store._id,
            });
          }
        });
      })
    );

    res.status(200).send({ carouselImages: [...carouselImages], storeInfo });
  } catch (error) {
    console.log(error);
  }
};

exports.sendOrders = async (req, res) => {
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id }).select(
      "_id"
    );

    const orders = await OrderSchema.find(
      { "items.store": store._id },
      {
        items: { $elemMatch: { store: store.id } },
        status: 1,
        user: 1,
        order_number: 1,
        createdAt: 1,
      }
    )
      .populate("items.products.product", "title")
      .populate("user", "_id name email")
      .sort({ createdAt: -1 });

    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
exports.sendOrderDetails = async (req, res) => {
  const { order_id } = req.params;
  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id }).select(
      "_id"
    );

    if (!store) return res.status(400).send("No store found");

    const order = await OrderSchema.findById(order_id, {
      items: { $elemMatch: { store: store.id } },
      status: 1,
      user: 1,
      address: 1,
      order_number: 1,
      createdAt: 1,
    })
      .populate("items.products.product")
      .populate("user", "-_id name lastName email");

    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

exports.setOrderStatus = async (req, res) => {
  const { order_id, action } = req.body;

  let status;
  if (action === "accept") status = "PREPARING_SHIPMENT";
  if (action === "reject") status = "CANCELLED";

  if (!status) return res.status(400).send("No action provided");

  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id }).select(
      "_id"
    );
    const order = await OrderSchema.findOneAndUpdate(
      { _id: order_id, "items.store": store._id },
      { "items.$.shipment_status": status },
      { new: true }
    );
    if (order) return res.status(200).send("Order status updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

exports.setTrackingCode = async (req, res) => {
  const { order_id, tracking_code } = req.body;

  try {
    const store = await StoreSchema.findOne({ user: req.userInfo.id }).select(
      "_id"
    );
    const order = await OrderSchema.findOneAndUpdate(
      { _id: order_id, "items.store": store._id },
      {
        "items.$.shipment_track_code": tracking_code,
        "items.$.shipment_status": "SHIPPED",
        "items.$.shipment_date": new Date(),
      },
      { new: true }
    );

    return res.status(200).send("Tracking code updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
