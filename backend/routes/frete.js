const express = require("express");
const router = express.Router();
const sdk = require('api')('@melhorenvio/v1.0#cyp6ra28lneli520');
const axios = require('axios')

router.post('/frete', async (req, res) => {
    res = await axios.post(`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=4287&redirect_uri=https://webstore-api-1d03bd2b0336.herokuapp.com/api/v1/frete/callback&response_type=code&scope=cart-read`)

    // sdk.solicitacaoDoToken({
    //   grant_type: 'authorization_code',
    //   client_id: 4177,
    //   client_secret: 'g9prpO2BtMDWhUqdcNeylb6lujUgmzn9pzn0n2Uv',
    //   redirect_uri: `${process.env.BASE_URL}/api/v1`,
    //   code: '200'
    // }, {
    //   'user-agent': 'WebStore (douglas.wai@outlook.com)'
    // })
    //   .then(({ data }) => console.log(data))
    //   .catch(err => console.error(err));
})

router.post('/frete/callback', async (req, res) => {
    console.log(req.body)
})

module.exports = router