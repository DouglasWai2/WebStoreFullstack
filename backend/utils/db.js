const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db()

module.exports = db