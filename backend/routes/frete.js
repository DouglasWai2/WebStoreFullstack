const express = require("express");
const router = express.Router();
const sdk = require('api')('@melhorenvio/v1.0#cyp6ra28lneli520');
const axios = require('axios')

router.post('/frete', async (req, res) => {

  return res
    .redirect(301, `https://www.melhorenvio.com.br/oauth/authorize?client_id=14224&redirect_uri=https://webstore-api-1d03bd2b0336.herokuapp.com/api/v1/frete/callback&response_type=code&scope=shipping-calculate`)
})

router.post('/frete/callback', async (req, res) => {
    console.log(req)
    res.send(req.body)
})

module.exports = router