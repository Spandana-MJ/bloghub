
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { validate, loginValidation } = require("../middleware/validators");
// Admin login
router.post("/login", loginLimiter, loginValidation, validate, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // JS cannot read this cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    res.json({ message: "Login successful" });
    // No token in response body anymore

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if user is logged in (called on app load)
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// Logout — clears the cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;