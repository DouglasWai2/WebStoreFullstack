const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { resetSellsToday } = require("./controllers/product.controller");
const orderSchema = require("./models/order.model");
const schedule = require("node-schedule");
const cookieParser = require("cookie-parser");
const {
  defaultLimiter,
  userLimiter,
  productsLimiter,
  storeLimiter,
} = require("./middlewares/rateLimitMiddleware");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("DB Connected"))
  .catch((error) => console.log(error));

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [`${process.env.ORIGIN}`, `https://sandbox.melhorenvio.com.br`],
  })
);
app.use(cookieParser());
app.use(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  require("./routes/webhook")
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/v1", (req, res) => {
  console.log("user hit the server");
  return res.status(200).send("Server OK");
});
app.set("trust proxy", 1);
app.get("/api/v1/ip", (req, res) => res.send(req.ip));

app.use("/api/v1", productsLimiter, require("./routes/catalog"));
app.use("/api/v1", require("./routes/rating"));
app.use("/api/v1", require("./routes/user"));
app.use("/api/v1", require("./routes/frete"));
app.use("/api/v1", storeLimiter, require("./routes/store"));
app.use("/api/v1", require("./routes/order"));
app.use("/api/v1/auth", require("./routes/auth/register"));
app.use("/api/v1/auth", require("./routes/auth/login"));
app.use("/api/v1/auth", require("./routes/auth/refreshToken"));
app.use("/api/v1/auth", require("./routes/auth/logout"));
app.use("/api/v1", require("./routes/search"));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}....`);
});

module.exports = app;


// Schedules
const job = schedule.scheduleJob("00 00 * * *", resetSellsToday);

schedule.scheduleJob("0 */3 * * *", async () => {
  try {
    await orderSchema.updateMany(
      {
        status: "PENDING_PAYMENT",
        createdAt: { $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      },
      { status: "CANCELED" }
    );
    console.log("orders canceled");
  } catch (error) {
    console.log(error);
  }
});