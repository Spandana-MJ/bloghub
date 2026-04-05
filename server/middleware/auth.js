
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Pass to global error handler
    next(err);
  }
};