const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { validate, loginValidation } = require("../middleware/validators");

// Cookie options — hardcoded for cross domain production
const cookieOptions = {
  httpOnly: true,
  secure: true,      // always true — Render uses HTTPS
  sameSite: "none",  // must be none for Vercel → Render cross domain
  maxAge: 24 * 60 * 60 * 1000,
};

// Login
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

    res.cookie("token", token, cookieOptions);
    res.json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check auth status
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;