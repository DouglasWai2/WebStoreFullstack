const express = require("express");
const router = express.Router();

const axios = require('axios')

router.get('/frete', async (req, res) => {
  const clientId = 4287
  const redirect_uri = `${process.env.BASE_URL}/api/v1/frete/callback`
  try{
    console.log('redirect_uri', redirect_uri)
    return res.redirect(301, `https://sandbox.melhorenvio.com.br/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&scope=shipping-calculate`)

  }catch(error){
    console.log(error)
    return res.status(400).send(error)
  }

})

router.get('/frete/callback', async (req, res) => {
    console.log(req)
    res.send(req.body)
})

module.exports = router