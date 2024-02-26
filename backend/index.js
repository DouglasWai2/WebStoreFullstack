const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const {
  defaultLimiter,
  userLimiter,
  productsLimiter,
  storeLimiter,
} = require("./middlewares/rateLimitMiddleware");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("DB Connected"))
  .catch((error) => console.log(error));

app.get("/api/v1", (req, res) => {
  console.log("user hit the server");
  return res.status(200).send("Server OK")
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", `${process.env.ORIGIN}`);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1", productsLimiter, require("./routes/catalog"));
app.use("/api/v1", require("./routes/rating"));
app.use("/api/v1", userLimiter, require("./routes/user"));
app.use("/api/v1", require("./routes/frete"));
app.use("/api/v1", storeLimiter, require("./routes/store"));
app.use("/api/v1", require("./routes/payments"));
app.use("/api/v1/auth", require("./routes/auth/register"));
app.use("/api/v1/auth", require("./routes/auth/login"));
app.use("/api/v1/auth", require("./routes/auth/refreshToken"));
app.use("/api/v1/auth", require("./routes/auth/logout"));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}....`);
});

module.exports = app;
