const diacriticSensitiveRegex = require("../helpers/diacriticSensitiveRegex");
const levenshteinDistance = require("../helpers/levenshteinDistance");
const productModel = require("../models/product.model");
const storeModel = require("../models/store.model");

exports.search = async (req, res) => {
  const { search } = req.query;

  
  try {
    const products = await productModel
      .find({
        $or: [
          { title: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
          { tags: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
        ],
      })
      .sort({ sells: -1 })
      .select("title thumbnail")
      .limit(10);

    const tags = await productModel.aggregate([
      // Filter for products that matches the search to reduce the $unwind operation
      {
        $search: {
          index: "titleSearch",
          autocomplete: {
            query: search,
            path: "tags",
          },
        },
      },

      // De-normalize the array content to separate documents
      { $unwind: "$tags" },

      // Filter the de-normalized content to remove non-matches
      {
        $match: { tags: new RegExp(diacriticSensitiveRegex(search), "i") },
      },
      { $limit: 5 },

      // Group the "like" terms as the "key"
      {
        $group: {
          _id: "$tags",
        },
      },
    ]);


    // Sort by the similarity of the search (levenshtein distance algorithm)
    tags.sort(
      (a, b) =>
        levenshteinDistance(search, a._id) - levenshteinDistance(search, b._id)
    );

    products.sort((a, b) => {
      return (
        levenshteinDistance(a.title, search) -
        levenshteinDistance(b.title, search)
      );
    });

    const stores = await storeModel
      .find({
        storeName: { $regex: diacriticSensitiveRegex(search), $options: "i" },
      })
      .select("storeName storeImage").limit(10);
    return res.status(200).json({ products, stores, tags });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
