const express = require('express')
const  addClothes  = require('../controllers/clothes')
const router = express.Router()

router.post('/', addClothes.addClothes)

module.exports = router