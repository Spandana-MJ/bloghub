
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const {
  apiLimiter,
  loginLimiter,
  commentLimiter,
} = require("./middleware/rateLimiter");
const { sanitizeBody } = require("./middleware/sanitize");
connectDB();

const app = express();

// 1. CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 2. Security headers
app.use(helmet());

// 3. Cookie parser
app.use(cookieParser());

// 4. Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. Request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(sanitizeBody);
// 6. Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 7. Rate limiting
app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/public/blogs/:id/comments", commentLimiter);

// 8. Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// 9. Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/public", require("./routes/public"));

// 10. Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));