const {logout} = require('../../controllers/logout.controller')
const express = require('express')
const router = express.Router()

router.get('/logout/:userId', logout)

module.exports = router