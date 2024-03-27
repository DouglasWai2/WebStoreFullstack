const orderSchema = require("../models/order.model");
const userSchema = require("../models/user.model");
const storeSchema = require("../models/store.model");
const productSchema = require("../models/product.model");
const addressSchema = require("../models/address.model");
const Stripe = require("stripe");
const { decryptData } = require("../utils/encryption");
const { calculateOrderAmount } = require("../helpers/calculateOrderAmount");
const { default: mongoose } = require("mongoose");
const stripe = Stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_WHSEC;

const STRIPE_URL = "https://api.stripe.com";

exports.validateOrder = async (req, res, next) => {
  const { order } = req.body;

  if (!order?.items.length) return res.status(400).send("Invalid order");

  try {
    // check if address exist
    const address = await addressSchema.findById(order.address, "-main");

    if (!address) {
      return res.status(400).send("Invalid address");
    }

    order.address = address;

    // Check if given products are from given store
    for (let i = 0; i < order.items.length; i++) {
      const { products } = await storeSchema
        .findById(order.items[i].store._id)
        .select("products");

      if (
        !order.items[i].products
          .map((item) => item.product._id)
          .every((item) => products.includes(item))
      ) {
        return res.status(400).send("Invalid store");
      }
    }

    function isEqual(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    // Save current price and discount for each product
    for (let i = 0; i < order.items.length; i++) {
      const decryptedShipment = JSON.parse(
        decryptData(order.items[i].shipment_hash)
      );

      // Check if given shipment method is valid
      if (
        !decryptedShipment.some((element) =>
          isEqual(element, order.items[i].shipment)
        )
      ) {
        return res.status(400).send("Invalid shipment");
      }

      for (let j = 0; j < order.items[i].products.length; j++) {
        const current = await productSchema
          .findById(order.items[i].products[j].product._id)
          .select("price discount dimensions");

        order.items[i].products[j].currentPrice = current.price;
        order.items[i].products[j].currentDiscount = current.discount;
      }
    }

    req.order = order;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.createOrder = async (req, res) => {
  const order = req.order;

  try {
    await orderSchema.deleteMany({ user: req.userInfo.id });
    await userSchema.updateOne(
      { _id: req.userInfo.id },
      { $set: { orders: [] } }
    );
    await storeSchema.updateMany({}, { $pull: { orders: order._id } });

    const orderCreated = await orderSchema.create({
      status: "PENDING_PAYMENT",
      user: req.userInfo.id,
      ...order,
    });
    const user = await userSchema.findByIdAndUpdate(
      req.userInfo.id,

      { $push: { orders: orderCreated._id } },
      
      // TODO: remove items from cart
      { new: true }
    );



    for (let i = 0; i < order.items.length; i++) {
      await storeSchema.updateOne(
        { _id: order.items[i].store._id },
        { $push: { orders: orderCreated._id } }
      );
    }

    return res.redirect("/api/v1/order/payment_intents/" + orderCreated._id);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

exports.createPaymentIntent = async (req, res) => {
  const { orderId } = req.params;
  let order;
  try {
    order = await orderSchema
      .findById(orderId)
      .populate("user")
      .populate("items.products.product", "title");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }

  if (!order) return res.status(400).send("Order not found");

  const amount = calculateOrderAmount(order.items);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount.replace(".", "")),
      currency: "brl",
      metadata: {
        order_id: order.id,
      },
      shipping: {
        address: {
          city: order.address.city,
          country: "BR",
          line1: order.address.street + ", " + order.address.number,
          postal_code: order.address.cep,
          state: order.address.state,
        },
        name: order.address.recieverName,
      },
      receipt_email: order.user.email,
    });

    return res.status(200).send({
      client_secret: paymentIntent.client_secret,
      order_id: order._id,
      amount,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

exports.retrieveOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderSchema
      .findById(orderId)
      .populate("items.store", "name")
      .populate("items.products.product", "title thumbnail")
      .populate("user", "_id");

    if (req.userInfo.id !== order.user.id)
      return res.status(400).send("Unauthorized user");

    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

exports.paymentIntents = async (req, res) => {
  const { payment_intent } = req.params;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  return res.redirect(
    "/api/v1/order/retrieve/" + paymentIntent.metadata.order_id
  );
};
