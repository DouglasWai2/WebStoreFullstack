const RatingSchema = require("../models/rating.model");

exports.rateProduct = (req, res) => {
  const { title,
    comment,
    author,
    images,
    rating } = req.body;

  const newRating = new RatingSchema({
    title,
    comment,
    author,
    images,
    rating,
  });
 
  try {
    newRating.save();
    res.status(200).send("Comment posted");
  } catch (error) {
    console.log(error);
  }
};
