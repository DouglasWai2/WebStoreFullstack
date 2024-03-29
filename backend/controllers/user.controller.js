const UserSchema = require("../models/user.model");
const AddressSchema = require("../models/address.model");
const StoreSchema = require("../models/store.model");
const ProductSchema = require("../models/product.model");
const OrderSchema = require("../models/order.model");
const { mongoose } = require("mongoose");

exports.sendUserInfo = async (req, res) => {
  try {
    const user = await UserSchema.findById(
      req.userInfo.id,
      "-password -refreshTokens"
    ).populate("address");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

exports.getUsersInterests = async (req, res) => {
  const productsIds = req.body;
  var interests = new Set();
  var storeInterest = new Set();

  try {
    await Promise.all(
      productsIds.map(async (element) => {
        const { tags } = await ProductSchema.findById(element);
        const { storeCategory } = await StoreSchema.findOne({
          products: element,
        });
        tags.forEach((tag) => {
          interests.add(tag);
        });
        storeInterest.add(storeCategory);
      })
    );

    const userInterests = {
      interest: [...interests],
      storeInterests: [...storeInterest],
    };

    return res.status(200).send(userInterests);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserData = async (req, res) => {
  const data = req.body;
  let user = await UserSchema.findById(req.userInfo.id);

  Object.keys(data).forEach((item) => {
    if (item) user[item] = data[item];
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
      const store = await StoreSchema.findByIdAndUpdate(
        storeId,
        {
          $inc: { likes: -1 },
        },
        { new: true }
      ).catch((err) => console.log(err));
      return res.status(200).send({ likes: store.likes, liked: false });
    } else {
      await UserSchema.findByIdAndUpdate(user, {
        $push: { saved_stores: storeId },
      }).catch((err) => console.log(err));
      const store = await StoreSchema.findByIdAndUpdate(
        storeId,
        {
          $inc: { likes: 1 },
        },
        { new: true }
      ).catch((err) => console.log(err));
      return res.status(200).send({ likes: store.likes, liked: true });
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
    await AddressSchema.findOneAndUpdate(
      { user: userid, main: true },
      { main: false }
    );

    newAddress.main = true;
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

exports.cart = async (req, res) => {
  const { productId, quantity, action } = req.body;

  try {
    if (action === "sync") {
      const { products } = req.body;
      console.log(products);
      const { cart } = await UserSchema.findById(req.userInfo.id, "cart");

      if (products) {
        products.forEach((product) => {
          const index = cart.findIndex(
            (item) => item.product.toString() === product.product
          );
          if (index === -1) {
            cart.push({
              product: product.product,
              quantity: product.quantity,
            });
          } else {
            cart[index].quantity = product.quantity;
          }
        });
      }

      const { cart: userCart } = await UserSchema.findByIdAndUpdate(
        req.userInfo.id,
        {
          $set: {
            cart: cart,
          },
        },
        { new: true }
      )
        .select("cart -_id")
        .populate("cart.product", "title price discount thumbnail");

      return res
        .status(200)
        .send({ message: "Cart synced successfully", cart: userCart });
    }

    if (action === "add") {
      const user = await UserSchema.findByIdAndUpdate(req.userInfo.id, {
        $addToSet: {
          cart: {
            product: productId,
            quantity: quantity,
          },
        },
      });
    }

    if (action === "update") {
      const user = await UserSchema.updateOne(
        {
          _id: req.userInfo.id,
          "cart.product": productId,
        },
        {
          $set: {
            "cart.$.quantity": quantity,
          },
        }
      );
    }

    if (action === "remove") {
      const user = await UserSchema.updateOne(
        {
          _id: req.userInfo.id,
        },
        {
          $pull: {
            cart: {
              product: { $in: [...productId] },
            },
          },
        }
      );
    }

    return res.status(200).send("Cart updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.orders = async (req, res) => {
  const { id } = req.userInfo;
  const orders = await OrderSchema.find({ user: id })
    .populate("items.products.product", "title thumbnail")
    .sort({ createdAt: -1 });

  return res.status(200).send(orders);
};
