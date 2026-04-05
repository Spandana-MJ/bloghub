// Only load .env file in development
// In production Render injects variables directly
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

// Temporary check — remove after confirming
console.log("ENV CHECK:", {
  hasMongoUri: !!process.env.MONGO_URI,
  hasJwtSecret: !!process.env.JWT_SECRET,
  hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
});

connectDB();

const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://bloghub-eight-alpha.vercel.app",
      process.env.CLIENT_URL,
    ].filter(Boolean);

    const isVercelPreview = origin.includes(
      "spandana-m-js-projects.vercel.app"
    );

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }

    console.log("CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/public/blogs/:id/comments", commentLimiter);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL,
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/public", require("./routes/public"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));