



const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_images",
    allowed_formats: ["jpg", "jpeg", "png", "avif"],
  },
});

const upload = multer({ storage });

// GET all blogs
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add blog
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, published } = req.body;
    const image = req.file ? req.file.path : null; // Cloudinary returns full URL in path

    const blog = new Blog({
      title,
      subtitle,
      description,
      image,
      published: published === "true",
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating blog" });
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
    res.status(500).json({ message: "Server error while updating blog" });
  }
});

// DELETE blog
router.delete("/:id", auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting blog" });
  }
});

module.exports = router;
