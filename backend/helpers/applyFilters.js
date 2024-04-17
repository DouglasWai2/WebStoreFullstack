const diacriticSensitiveRegex = require("./diacriticSensitiveRegex");

const applyFilters = (queries) => {
  const {
    search,
    from,
    to,
    fromDate,
    toDate,
    fromRating,
    toRating,
    sortBy,
    order,
    category,
    title,
    maxPrice,
    minPrice,
  } = queries;

  let match = {};

  var $and = [];

  let options = {};

  if (search) {
    $and.push({
      $or: [
        { title: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
        { tags: { $regex: diacriticSensitiveRegex(search), $options: "i" } },
      ],
    });
  }

  if (fromDate) {
    $and.push({
      $or: [
        {
          $and: [
            { createdAt: { $gt: fromDate } },
            { createdAt: { $lt: toDate } },
          ],
        },
        {
          $and: [
            { legacyCreatedAt: { $gt: fromDate } },
            { legacyCreatedAt: { $lt: toDate } },
          ],
        },
      ],
    });
  }

  if (fromRating) {
    $and.push({
      $and: [
        { rating: { $gte: parseFloat(fromRating) } },
        { rating: { $lte: parseFloat(toRating) } },
      ],
    });
  }

  if (maxPrice) {
    match.price = { $lte: parseFloat(maxPrice) };
  }

  if (minPrice) {
    match.price = { $gte: parseFloat(minPrice) };
  }

  if (category) {
    match.tags = category;
  }
  if (title) {
    match.title = { $regex: diacriticSensitiveRegex(title), $options: "i" };
  }

  if ($and.length) {
    match.$and = $and;
  }

  if (sortBy) {
    options.sort = { [sortBy]: order, _id: 1 };
  }

  if (from) {
    options.skip = from;
  }

  if (to) {
    options.limit = to;
  }

  return { match, options };
};

module.exports = applyFilters;
