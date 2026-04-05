
const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");


const {
  validate,
  blogValidation,
} = require("../middleware/validators");

// GET all blogs (admin)
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single blog by id (admin - for edit form)
router.get("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add blog
router.post("/", auth, upload.single("image"),blogValidation,
  validate, async (req, res) => {
  try {
    const { title, subtitle, description, published, category } = req.body;
    const image = req.file ? req.file.path : null;

    const blog = new Blog({
      title,
      subtitle,
      description,
      image,
      category: category || "Other",
      published: published === "true",
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating blog" });
  }
});

// PUT update blog content (edit)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, category } = req.body;
    const updateData = { title, subtitle, description, category };

    if (req.file) updateData.image = req.file.path;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating blog" });
  }
});

// PUT publish/unpublish
router.put("/:id/publish", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.published = !blog.published;
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE blog
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;