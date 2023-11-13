const {logout} = require('../../controllers/logout.controller')
const express = require('express')
const router = express.Router()

router.get('/logout', logout)

module.exports = router