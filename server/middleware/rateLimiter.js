
const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 minutes per IP
  message: {
    message: "Too many requests, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for login — prevents brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 login attempts per 15 minutes
  message: {
    message: "Too many login attempts, please try again after 15 minutes"
  },
});

// Comment limiter — prevents comment spam
const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // max 3 comments per minute
  message: {
    message: "Too many comments, please slow down"
  },
});

module.exports = { apiLimiter, loginLimiter, commentLimiter };