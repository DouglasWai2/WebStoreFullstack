const axios = require("axios");
const storeSchema = require("../models/store.model");
const productSchema = require("../models/product.model");
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
  const _ids = products.map(
    (product) => new mongoose.Types.ObjectId(product.productId)
  );

  try {
    const productsByStore = await productSchema.aggregate([
      {
        $match: {
          _id: { $in: _ids },
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
        $project: {
          _id: 1,
          dimensions: 1,
          price: 1,
          store: {
            _id: 1,
            storeAdress: {
              cep: 1,
            },
          },
        },
      },
      {
        $group: {
          _id: "$store._id",
          items: { $push: "$$ROOT" },
        },
      },
    ]);

    console.log(productsByStore);
    

    productsByStore.forEach(async (item) => {
      // products: {
      //   productId:
      //   quantity:
      // }
      // productsByStore: [
      //   {
      //     _id: storeid,
      //     item: {
      //       _id: productid,
      //       dimensions: 1,
      //       price: 1,
      //       store: {
      //         _id: 1,
      //         storeAdress: {
      //           cep: 1,
      //         },
      //       },
      //     },
      //   },
      //   {
      //     _id: storeid,
      //     item: {
      //       _id: productid,
      //       dimensions: 1,
      //       price: 1,
      //       store: {
      //         _id: 1,
      //         storeAdress: {
      //           cep: 1,
      //         },
      //       },
      //     },
      //   },
      // ];



    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
};

async function getShipmentPrice(store, to) {
  const options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
    headers: { ...headers, Authorization: `Bearer ${access_token}` },
    data: {
      from: { postal_code: "96020360" },
      to: { postal_code: "08451420" },
      products: [
        {
          id: "x",
          width: 11,
          height: 17,
          length: 11,
          weight: 0.3,
          insurance_value: 10.1,
          quantity: 1,
        },
        {
          id: "y",
          width: 16,
          height: 25,
          length: 11,
          weight: 0.3,
          insurance_value: 55.05,
          quantity: 2,
        },
        {
          id: "z",
          width: 22,
          height: 30,
          length: 11,
          weight: 1,
          insurance_value: 30,
          quantity: 1,
        },
      ],
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
