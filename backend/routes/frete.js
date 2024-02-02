const frete = require('frete')
const express = require("express");
const router = express.Router();

router.get('/frete', async (req,res) => {
    // const results = await frete()
    // .cepOrigem('13467460')
    // .servico(frete.servicos.sedex)
    // .prazo('13466321');

    // console.log(results);
})

module.exports = router