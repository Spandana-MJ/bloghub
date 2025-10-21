// // const express = require("express");
// // const router = express.Router();
// // const Blog = require("../models/Blog");
// // const auth = require("../middleware/auth");
// // const multer = require("multer");

// // // Multer config
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// // });
// // const upload = multer({ storage });

// // // GET all blogs
// // router.get("/", auth, async (req, res) => {
// //   const blogs = await Blog.find();
// //   res.json(blogs);
// // });

// // // POST add blog
// // router.post("/", auth, upload.single("image"), async (req, res) => {
// //   const { title, subtitle, description,published } = req.body;
// //   const image = req.file ? req.file.filename : null;
// //   const blog = new Blog({ title, subtitle, description, image, published: published === "true" });
// //   await blog.save();
// //   res.json(blog);
// // });




// // // PUT publish/unpublish
// // router.put("/:id/publish", auth, async (req, res) => {
// //   const blog = await Blog.findById(req.params.id);
// //   blog.published = !blog.published;
// //   await blog.save();
// //   res.json(blog);
// // });

// // // DELETE blog
// // router.delete("/:id", auth, async (req, res) => {
// //   await Blog.findByIdAndDelete(req.params.id);
// //   res.json({ message: "Blog deleted" });
// // });

// // module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Blog = require("../models/Blog");
// const auth = require("../middleware/auth");
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;

// // ✅ Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Multer Cloudinary storage setup
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "mern-blog", // your folder name in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });

// const upload = multer({ storage });

// // ✅ GET all blogs
// router.get("/", auth, async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.json(blogs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching blogs" });
//   }
// });

// // ✅ POST add blog (with Cloudinary image upload)
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     const { title, subtitle, description, published } = req.body;
    
//     const image = req.file ? req.file.path : null;
//     const public_id = req.file ? req.file.filename : null;

//     const blog = new Blog({
//       title,
//       subtitle,
//       description,
//       image,
//       public_id,
//       published: published === "true",
//     });

//     await blog.save();
//     res.json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating blog" });
//   }
// });


// // ✅ PUT publish/unpublish
// router.put("/:id/publish", auth, async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     blog.published = !blog.published;
//     await blog.save();
//     res.json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating blog" });
//   }
// });

// // ✅ DELETE blog
// // router.delete("/:id", auth, async (req, res) => {
// //   try {
// //     await Blog.findByIdAndDelete(req.params.id);
// //     res.json({ message: "Blog deleted" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error deleting blog" });
// //   }
// // });

// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     // ✅ Delete image from Cloudinary first
//     if (blog.public_id) {
//       await cloudinary.uploader.destroy(blog.public_id);
//     }

//     // ✅ Then delete blog from MongoDB
//     await Blog.findByIdAndDelete(req.params.id);

//     res.json({ message: "Blog and image deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error deleting blog" });
//   }
// });


// module.exports = router;





const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern-blog",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
const upload = multer({ storage });

// GET all blogs
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find();
    console.log("Fetched blogs:", JSON.stringify(blogs, null, 2));
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// POST add blog
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, published } = req.body;
    const image = req.file ? req.file.path : null;

    console.log("Creating blog:", JSON.stringify({ title, subtitle, published, image }, null, 2));

    const blog = new Blog({
      title,
      subtitle,
      description,
      image,
      published: published === "true",
    });

    await blog.save();
    console.log("Blog saved successfully:", JSON.stringify(blog, null, 2));
    res.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Error creating blog" });
  }
});

// PUT publish/unpublish
router.put("/:id/publish", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.published = !blog.published;
    await blog.save();

    console.log("Blog publish status updated:", JSON.stringify(blog, null, 2));
    res.json(blog);
  } catch (error) {
    console.error("Error updating blog:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Error updating blog" });
  }
});

// DELETE blog (with Cloudinary image deletion)
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image from Cloudinary if exists
    if (blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0]; // extract publicId
      await cloudinary.uploader.destroy(`mern-blog/${publicId}`);
      console.log("Deleted image from Cloudinary:", blog.image);
    }

    await Blog.findByIdAndDelete(req.params.id);
    console.log("Blog deleted:", JSON.stringify(blog, null, 2));
    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Error deleting blog" });
  }
});

module.exports = router;
