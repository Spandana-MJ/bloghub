
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
   public_id: String, 
   likes: { type: Number, default: 0 },
    category: { 
    type: String, 
    enum: ["Technology", "Lifestyle", "Travel", 
           "Food", "Health", "Business", "Other"],
    default: "Other"
  },
    views: { type: Number, default: 0 },
  published: { type: Boolean, default: false }, // ✅ default false
  createdAt: { type: Date, default: Date.now },
});
blogSchema.index({ title: "text", subtitle: "text" }); 
blogSchema.index({ published: 1, createdAt: -1 });    
blogSchema.index({ category: 1 });      
module.exports = mongoose.model("Blog", blogSchema);


