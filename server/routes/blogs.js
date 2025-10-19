const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const multer = require("multer");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all blogs
router.get("/", auth, async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// POST add blog
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { title, subtitle, description,published } = req.body;
  const image = req.file ? req.file.filename : null;
  const blog = new Blog({ title, subtitle, description, image, published: published === "true" });
  await blog.save();
  res.json(blog);
});




// PUT publish/unpublish
router.put("/:id/publish", auth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.published = !blog.published;
  await blog.save();
  res.json(blog);
});

// DELETE blog
router.delete("/:id", auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog deleted" });
});

module.exports = router;
