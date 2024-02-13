const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const StoreSchema = require("../models/store.model");
const auth = require("../middlewares/verifyToken");
require("dotenv").config();

// send user info
router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.userInfo.id);

  res.status(200).json({
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    cpf: user.cpf,
    phone: user.phone,
    birth: user.birth,
    role: user.role,
    saved_stores: user.saved_stores
  });
});

// update user data
router.post("/user/update", auth, async (req, res) => {
  const data = req.body;
  const user = await User.findById(req.userInfo.id);

  data.map((item) => {
    if (Object.values(item)[0]) {
      user[item.value] = Object.values(item)[0];
    }
  });

  try {
    await user.save();
    res.status(200).send("User data updated");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/user/like_store", auth, async (req, res) => {
  const { storeId } = req.body;
  const user = req.userInfo.id;

  try {
    const { saved_stores } = await User.findById(user);
    if (saved_stores.indexOf(storeId) >= 0) {
      await User.findByIdAndUpdate(user, {
        $pull: { saved_stores: storeId },
      }).catch((err) => console.log(err));
      await StoreSchema.findByIdAndUpdate(storeId, {
        $inc: { likes: -1 },
      }).catch((err) => console.log(err));
      return res.status(200).send("store unliked successfully");
    } else {
      await User.findByIdAndUpdate(user, {
        $push: { saved_stores: storeId },
      }).catch((err) => console.log(err));
      await StoreSchema.findByIdAndUpdate(storeId, {
        $inc: { likes: 1 },
      }).catch((err) => console.log(err));
      return res.status(200).send("store liked successfully");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
