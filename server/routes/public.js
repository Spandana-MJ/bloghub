
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const BlogView = require("../models/BlogView");


// routes/public.js — update GET /blogs
router.get("/blogs", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 6 } = req.query;

    // Build query object dynamically
    const query = { published: true };

    // Add search if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
      ];
    }

    // Add category filter if provided
    if (category && category !== "All") {
      query.category = category;
    }

    // Count total matching blogs for pagination
    const total = await Blog.countDocuments(query);

    // Fetch paginated results
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single blog with approved comments
router.get("/blogs/:id", async (req, res) => {
  try {
    // Get visitor IP address
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] || // works on Render
      req.socket.remoteAddress ||                       // fallback
      "unknown";

    // Check if this IP already viewed this blog in last 24 hours
    const existingView = await BlogView.findOne({
      blogId: req.params.id,
      ipAddress: ipAddress,
    });

    let blog;

    if (existingView) {
      // Already viewed — just fetch without incrementing
      blog = await Blog.findById(req.params.id);
    } else {
      // New view — increment counter
      blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      
      try {
        await BlogView.create({
          blogId: req.params.id,
          ipAddress: ipAddress,
        });
      } catch (dupErr) {
        // duplicate key error — means race condition
        // view was already recorded, just ignore
      }
    }

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comments = await Comment.find({
      blogId: req.params.id,
      approved: true,
    }).sort({ createdAt: -1 });

    res.json({ blog, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add comment (public)
router.post("/blogs/:id/comments", async (req, res) => {
  try {
    const { name, text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = new Comment({
      blogId: blog._id,
      blogTitle: blog.title,
      name,
      text,
    });

    await comment.save();
    res.json({ message: "Comment submitted for approval" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/blogs/:id/like", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/blogs/:id/unlike", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;