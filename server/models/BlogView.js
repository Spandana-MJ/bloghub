const mongoose = require("mongoose");

const blogViewSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    // automatically delete this record after 24 hours
    // so the same person counts as new view next day
    expires: 86400, // 86400 seconds = 24 hours
  },
});

// Compound index — one record per blog per IP
blogViewSchema.index({ blogId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model("BlogView", blogViewSchema);