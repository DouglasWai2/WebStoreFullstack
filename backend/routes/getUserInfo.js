const express = require("express");
const router = express.Router();
const User = require('../models/user.model')
const auth = require('../middlewares/verifyToken')

router.get('/:userid/:access_token', auth, async (req, res) => {
    const user = await User.findById(req.params.userid)
    console.log(user)
})

module.exports = router
