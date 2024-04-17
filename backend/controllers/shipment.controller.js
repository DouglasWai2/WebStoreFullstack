const axios = require("axios");
const storeSchema = require("../models/store.model");
const productSchema = require("../models/product.model");
const userSchema = require("../models/user.model");
const mongoose = require("mongoose");
const { encryptData } = require("../utils/encryption");
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

    console.log(data);  

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
  const { to, id } = req.body;
  const price = [];

  try {

    if (id) {
      const productPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "Stores",
            localField: "store",
            foreignField: "_id",
            as: "store",
          },
        },
        {
          $unwind: {
            path: "$store",
          },
        },
        {
          $group: {
            _id: {
              products: { product: "$$ROOT" },
              storeAddress: "$store.storeAddress.cep",
              storeName: "$store.storeName",
              storeImage: "$store.storeImage",
              storeId: "$store._id",
            },
          },
        },
        {
          $project: {
            _id: {
              products: [
                {
                  product: {
                    title: "$_id.products.product.title",
                    thumbnail: "$_id.products.product.thumbnail",
                    price: "$_id.products.product.price",
                    discount: "$_id.products.product.discount",
                    _id: "$_id.products.product._id",
                    dimensions: "$_id.products.product.dimensions",
                  },
                },
              ],
    
              store: {
                _id: "$_id.storeId",
                storeAddress: "$_id.storeAddress",
                storeName: "$_id.storeName",
                storeImage: "$_id.storeImage",
              },
            },
          },
        },
      ];
    
      const result = await productSchema.aggregate(productPipeline);

      const { _id: cart } = result[0];

      cart.products[0].quantity = 1;

      if (!to) return res.status(200).send([cart]);

      const shipment = await getShipmentPrice(cart, to);
      const shipment_hash = encryptData(JSON.stringify(shipment));

      price.push({
        store: cart.store,
        products: cart.products,
        shipment,
        shipment_hash,
      });
    } else {

      const cartPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.userInfo.id),
          },
        },
        {
          $unwind: "$cart",
        },
        {
          // "Populate" the product field in cart array
          $lookup: {
            from: "Catalog",
            localField: "cart.product",
            foreignField: "_id",
            as: "cart.product",
          },
        },
        {
          $unwind: {
            path: "$cart.product",
          },
        },
        {
          // "Populate" the store field in products
          $lookup: {
            from: "Stores",
            localField: "cart.product.store",
            foreignField: "_id",
            as: "store",
          },
        },
        {
          $unwind: {
            path: "$store",
          },
        },
        {
          // Group results by store
          $group: {
            _id: "$store._id",
    
            // Get only the first because all store info are the same for each element in products array
            storeAddress: { $first: "$store.storeAddress.cep" },
            storeName: { $first: "$store.storeName" },
            storeImage: { $first: "$store.storeImage" },
            products: { $addToSet: "$cart" },
          },
        },
        {
          // Project ("select") only the necessary fields
          $project: {
            store: {
              _id: "$_id",
              storeAddress: "$storeAddress",
              storeName: "$storeName",
              storeImage: "$storeImage",
            },
            "products.product.thumbnail": 1,
            "products.product.title": 1,
            "products.product.discount": 1,
            "products.product._id": 1,
            "products.product.dimensions": 1,
            "products.product.price": 1,
            "products.quantity": 1,
          },
        },
      ];

      const cart = await userSchema.aggregate(cartPipeline);

      if (!to) return res.status(200).send(cart);

      for (let i = 0; i < cart.length; i++) {
        const shipment = await getShipmentPrice(cart[i], to);
        const shipment_hash = encryptData(JSON.stringify(shipment));
        price.push({
          store: cart[i].store,
          products: cart[i].products,
          shipment,
          shipment_hash,
        });
      }
    }

    return res.status(200).send(price);

  } catch (error) {

    console.log(error);
    return res.status(400).send(error);
    
  }
};

async function getShipmentPrice(cart, to) {
  const products = cart.products.map((item) => {
    const { _id, dimensions, price } = item.product;
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

  const options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
    headers: { ...headers, Authorization: `Bearer ${access_token}` },
    data: {
      from: { postal_code: cart.store.storeAddress },
      to: { postal_code: to },
      products,
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
