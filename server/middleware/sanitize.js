
const xss = require("xss");

// Sanitize a single string value
const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return xss(value);
};

// Middleware to sanitize req.body fields
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }
  next();
};

module.exports = { sanitizeBody, sanitizeString };