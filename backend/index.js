const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("DB Connected"))
  .catch((error) => console.log(error));

app.get("/api", (req, res) => {
  console.log("user hit the server");
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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

app.use("/api", require("./routes/catalog"));
app.use("/api", require("./routes/rating"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/address"));
app.use("/api", require("./routes/store"));
app.use("/api", require("./routes/payments"));
app.use("/auth", require("./routes/auth/register"));
app.use("/auth", require("./routes/auth/login"));
app.use("/auth", require("./routes/auth/refreshToken"));
app.use("/auth", require("./routes/auth/logout"));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}....`);
});
