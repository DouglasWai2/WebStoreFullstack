const axios = require("axios");
const storeSchema = require("../models/store.model");
const productSchema = require("../models/product.model");
const userSchema = require("../models/user.model");
const mongoose = require("mongoose");
const client_id = 4287;
const redirect_uri = `${process.env.BASE_URL}/api/v1/frete/callback`;
const client_secret = process.env.MELHORENVIO_CLIENT_SECRET;
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "User-Agent": "WebStore (douglas.wai@outlook.com)",
};

let access_token = process.env.MELHORENVIO_ACCESS_TOKEN;

exports.redirectME = async (req, res) => {
  return res.redirect(
    301,
    `https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=shipping-calculate shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking`
  );
};

exports.getTokens = async (req, res) => {
  const { code, state } = req.query;

  const options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/oauth/token",
    headers,
    data: {
      grant_type: "authorization_code",
      client_id,
      client_secret,
      redirect_uri,
      code,
    },
  };

  try {
    const { data } = await axios.request(options);

    const store = await storeSchema.findOneAndUpdate(
      {
        user: state,
      },
      { $set: { melhorEnvios: { ...data } } }
    );

    return res.status(200).send(
      `<script>
          window.location.href = 'https://webstore-app.shop/'
        </script>`
    );
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.response.data);
  }
};

exports.calculateShipment = async (req, res) => {
  const { to, products } = req.body;

  console.log(to)

  const _ids = products.map(
    (product) => new mongoose.Types.ObjectId(product.productId)
  );

  try {
    const cart = await userSchema.aggregate([
      {
        $unwind: "$cart", // Unwind the cart array
      },
      {
        $lookup: {
          from: "Catalog",
          localField: "cart.product",
          foreignField: "_id",
          as: "cart.product", // Replace product ObjectId with product details
        },
      },
      {
        $unwind: {
          path: "$cart.product",
          preserveNullAndEmptyArrays: true, // Preserve unmatched products
        },
      },
      {
        $lookup: {
          from: "Stores",
          localField: "cart.product.store",
          foreignField: "_id",
          as: "store", // Replace store ObjectId with store details
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true, // Preserve unmatched stores
        },
      },
      {
        $group: {
          _id: {
            storeId: "$store._id",
          },
          storeAddress: { $first: "$store.storeAddress.cep" },
          products: { $push: "$cart" }, // Push the products into an array
        },
      },
      {
        $project: {
          _id: "$_id.storeId",
          storeAddress: 1,
          "products.product._id": 1,
          "products.product.dimensions": 1,
          "products.product.price": 1,
          "products.quantity": 1,
        },
      },
    ]);
    console.log(cart);

    // const price = await getShipmentPrice(cart[0], to);


    console.log(price)
    // productsByStore.forEach(async (item) => {});
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

async function getShipmentPrice(cart, to) {
  const products = cart.products.map((item) => {
    const { _id, dimensions, price, quantity } = item.product;
    const { width, height, length, weight } = dimensions;
    return {
      id: _id,
      width,
      height,
      length,
      weight,
      insurance_value: price,
      quantity: item.quantity,
    };
  });

  console.log("Products", products);

  const options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
    headers: { ...headers, Authorization: `Bearer ${access_token}` },
    data: {
      from: { postal_code: cart.storeAddress },
      to: { postal_code: to },
      products
    },
  };

  try {
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
