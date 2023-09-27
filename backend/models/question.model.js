const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  productID: { type: String, required: true },
  question: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = mongoose.model("question", QuestionSchema, "Questions");