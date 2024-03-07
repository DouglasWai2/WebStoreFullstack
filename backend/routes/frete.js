const express = require("express");
const router = express.Router();
const sdk = require('api')('@melhorenvio/v1.0#cyp6ra28lneli520');
const axios = require('axios')

router.get('/frete', async (req, res) => {
    res
    .status(301)
    .redirect(`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=4287&redirect_uri=https://webstore-api-1d03bd2b0336.herokuapp.com/api/v1/frete/callback&response_type=code&scope=cart-read`)
})

router.post('/frete/callback', async (req, res) => {
    console.log(req.body)
})

module.exports = router