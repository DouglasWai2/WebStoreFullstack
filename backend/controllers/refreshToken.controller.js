const { jwtExpiration,
  jwtRefreshExpiration,
  testjwtExpiration,
  testjwtRefreshExpiration } = require('../utils/expiration')

exports.refreshToken = (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.SECRET_JWT_KEY,
      { expiresIn: testjwtExpiration }
    );

    res.header("Authorization", accessToken).send(decoded.user);
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};
