const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middlewares/verifyToken");
const storeSchema = require("../models/store.model");

router.get("/frete", async (req, res) => {
  const clientId = 4287;
  const redirect_uri = `${process.env.BASE_URL}/api/v1/frete/callback`;

  return res.redirect("/");
});

router.get("/frete/callback", async (req, res) => {
  const { code, state } = req.query;
  const client_id = 4287;
  const redirect_uri = `${process.env.BASE_URL}/api/v1/frete/callback`;
  const client_secret = process.env.MELHORENVIO_CLIENT_SECRET;

  const options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/oauth/token",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "WebStore (douglas.wai@outlook.com)",
    },
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

    console.log(data)

    // const { refresh_token, access_token } = data;

    // const store = await storeSchema.findOneAndUpdate(
    //   {
    //     user: state,
    //   },
    //   { $set: { melhorEnvios: { access_token, refresh_token } } }
    // );

    return res.status(200).send(`<script>
  window.location.href = 'https://webstore-app.shop/store/mystore'
</script>`);
  } catch (error) {
    console.error(error);
    return res.status(400).send(error.response.data);
  }
});

module.exports = router;
