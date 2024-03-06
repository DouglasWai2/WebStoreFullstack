const express = require("express");
const router = express.Router();
const sdk = require('api')('@melhorenvio/v1.0#cyp6ra28lneli520');
const axios = require('axios')

router.get('/frete', async (req, res) => {
    // res = await axios.post(`https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=4177&redirect_uri=https://github.com&response_type=code&scope=cart-read`)

    sdk.solicitacaoDoToken({
      grant_type: 'authorization_code',
      client_id: 4177,
      client_secret: 'g9prpO2BtMDWhUqdcNeylb6lujUgmzn9pzn0n2Uv',
      redirect_uri: `${process.env.BASE_URL}/api/v1`,
      code: '200'
    }, {
      'user-agent': 'WebStore (douglas.wai@outlook.com)'
    })
      .then(({ data }) => console.log(data))
      .catch(err => console.error(err));
})

module.exports = router