
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import RichTextEditor from "../components/RichTextEditor";

const CATEGORIES = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Food",
  "Health",
  "Business",
  "Other",
];

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/blogs/${id}`);
        setTitle(res.data.title);
        setSubtitle(res.data.subtitle);
        setCategory(res.data.category || "Other");
        setImagePreview(res.data.image || null);
        setDescription(res.data.description || "");
      } catch (err) {
        toast.error("Failed to load blog");
        navigate("/blog-list");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || description === "<p></p>") {
      toast.error("Description is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("category", category);
      formData.append("description", description);
      if (image) formData.append("image", image);

      await api.put(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully!");
      navigate("/blog-list");
    } catch (err) {
      toast.error("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10
                        border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-b from-white via-gray-50
                    to-indigo-50 px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl
                      shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-center mb-6
                       text-gray-900">
          ✏️ Edit Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold
                               text-gray-700 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter blog title"
              maxLength={100}
              required
            />
            <p className={`text-xs mt-1 text-right
              ${title.length > 80 ? "text-red-400" : "text-gray-400"}`}>
              {title.length}/100
            </p>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-semibold
                               text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter blog subtitle"
              maxLength={150}
              required
            />
            <p className={`text-xs mt-1 text-right
              ${subtitle.length > 120
                ? "text-red-400"
                : "text-gray-400"}`}>
              {subtitle.length}/150
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold
                               text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300
                         focus:ring-2 focus:ring-indigo-500
                         outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-semibold
                               text-gray-700 mb-1">
              Description
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* Image Upload */}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-semibold
                                 text-gray-700 mb-1">
                Update Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-lg border border-gray-200
                           p-2 bg-gray-50"
              />
            </div>
            <div className="w-40 h-28 rounded-lg border flex
                            items-center justify-center
                            overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  No Image
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3
                       rounded-lg font-semibold hover:bg-indigo-700
                       transition disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}