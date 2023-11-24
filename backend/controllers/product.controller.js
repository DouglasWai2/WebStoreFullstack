const clothesSchema = require("../models/product.models");

exports.addProduct = async (req, res) => {
  const { title, description, tags, genre, features } = req.body;

  const newCloth = new clothesSchema({
    title,
    description,
    tags,
    genre,
    features,
  });
  newCloth.thumbnail = req.files[0].location;
  newCloth.images = req.files.map((file) => {
    return file.location;
  });

  try {
    await newCloth.save();
    res.status(200).send("Product saved successfully");
  } catch (error) {
    console.log(error);
  }
};
