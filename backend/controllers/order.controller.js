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

    const lastOrder = await orderSchema
      .find({}, "order_number")
      .sort({
        order_number: -1,
      })
      .limit(1);
    orderCreated.order_number = lastOrder[0].order_number + 1 || 1;
    await orderCreated.save();

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
      .populate("items.store", "storeName")
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
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    return res.redirect(
      "/api/v1/order/retrieve/" + paymentIntent.metadata.order_id
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};
exports.getClientSecret = async (req, res) => {
  const { payment_intent } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
    const order = await orderSchema
      .findById(paymentIntent.metadata.order_id, "user")
      .populate("user", "_id");

    if (req.userInfo.id !== order.user.id)
      return res.status(400).send("Unauthorized user");

    return res.status(200).send({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

exports.markAsDelivered = async (req, res) => {
  const { orderId, storeId } = req.body;

  try {
    const order = await orderSchema
      .findById(orderId, "user items status")
      .populate("user", "_id")
      .populate("items.store", "_id");
    if (!order) return res.status(400).send("Order not found");
    if (order.status !== "PAYMENT_APPROVED")
      return res.status(400).send("Payment not approved");
    if (order.user.id !== req.userInfo.id)
      return res.status(400).send("Unauthorized user");

    for (let item in order.items) {
      if (order.items[item].store.id === storeId) {
        order.items[item].shipment_status = "DELIVERED";
        await order.save();
        return res.status(200).send("Order marked as delivered");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

exports.sendProductsToRate = async (req, res) => {
  const { store_id, order_id } = req.params;
  try {
    const products = await orderSchema
      .findById(order_id, {
        items: { $elemMatch: { store: store_id } },
        status: 1,
        user: 1,
        order_number: 1,
        createdAt: 1,
      })
      .populate("items.products.product", "title thumbnail rating")
      .populate("user", "_id")
      .populate("items.store", "storeName storeImage");

    if (products.user.id !== req.userInfo.id)
      return res.status(400).send("Unauthorized user");

    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
