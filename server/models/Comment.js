const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  blogTitle: String,
  name: String, 
  text: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
commentSchema.index({ blogId: 1, approved: 1 });
module.exports = mongoose.model("Comment", commentSchema);
