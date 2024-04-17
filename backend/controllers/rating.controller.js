const userSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
const RatingSchema = require("../models/rating.model");
const storeSchema = require("../models/store.model");
const orderSchema = require("../models/order.model");

exports.rateProduct = async (req, res, next) => {
  const { ratings, storeId, orderId } = req.body;
  
  try {
    const order = await orderSchema.findById(orderId, {
      items: { $elemMatch: { store: storeId } },
    });

    if(order.items[0].rated) return res.status(400).send("Already rated");
    order.items[0].rated = true;
    await order.save();

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

  for (let i = 0; i < ratings.length; i++) {
    const { product, title, comment, rating } = ratings[i];

    const newRating = new RatingSchema({
      product: product,
      title,
      comment,
      user: req.userInfo.id,
      images: [],
      rating, 
    })

    try {
      await newRating.save();
      await userSchema.findByIdAndUpdate(req.userInfo.id, {
        $push: { ratings: newRating._id },
      })

      await productSchema.findByIdAndUpdate(product, {
        $push: { ratings: newRating._id },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error posting comment");
    }
  }

  
  next();
};

exports.rateStore = async (req, res) => {
  const { storeRating, storeId } = req.body;

  try {
    await storeSchema.findByIdAndUpdate(storeId, {
      $push: { rating: storeRating },
    });
    return res.status(200).send("Success");
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
};
