const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// GET all published blogs
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single blog with comments
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comments = await Comment.find({ blogId: req.params.id, approved: true }).sort({ createdAt: -1 });
    res.json({ blog, comments });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add comment
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

module.exports = router;
