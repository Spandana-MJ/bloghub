const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// GET all comments
router.get("/", auth, async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

// PUT approve comment
router.put("/:id/approve", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.approved = true;
  await comment.save();
  res.json(comment);
});

// DELETE comment
router.delete("/:id", auth, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
});

module.exports = router;
