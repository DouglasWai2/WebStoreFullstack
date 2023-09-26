const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.SECRET_JWT_TOKEN,
      { expiresIn: "1h" }
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .header("Authorization", accessToken)
      .send(decoded.user);
  } catch (error) {
    return res.status(400).send("Invalid Token.");
  }
};

module.exports = verifyToken;
