const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const auth = require("./middlewares/verifyToken");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("DB Connected"))
  .catch((error) => console.log(error));

app.get("/api", (req, res) => {
  console.log("user hit the server");
});

app.use("/api", auth, require("./routes/clothes"));
app.use("/auth", require("./routes/auth/register"));
app.use("/auth", require("./routes/auth/login"));
app.use("/api", require("./routes/rating"));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}....`);
});
