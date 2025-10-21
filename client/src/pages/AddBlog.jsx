
import { useRef, useState } from "react";
import axios from "axios";
import api from "../api";
import {
  Image,
  Check,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddBlog() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [publish, setPublish] = useState(false);

  const exec = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      editorRef.current && editorRef.current.focus();
    } catch (err) {
      console.error("Formatting command failed", err);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const descriptionHtml = editorRef.current?.innerHTML || "";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", descriptionHtml);
      formData.append("published", publish ? "true" : "false");
      if (image) formData.append("image", image);

      await api.post("/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(" Blog added successfully!");
      setTitle("");
      setSubtitle("");
      editorRef.current && (editorRef.current.innerHTML = "");
      setImage(null);
      setImagePreview(null);
      setPublish(false);
     }
      // catch (err) {
    //   console.error(err);
    //   toast.error(" Error adding blog");
    // }
    catch (err) {
  if (err.response) {
    console.error("Response Error:", err.response.data);
    toast.error(`Error: ${err.response.data.message || "Failed to add blog"}`);
  } else if (err.request) {
    console.error("Request Error:", err.request);
    toast.error("No response from server");
  } else {
    console.error("Unknown Error:", err.message);
    toast.error("Something went wrong");
  }
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-indigo-50 px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          ✍️ Add New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter blog subtitle"
              required
            />
          </div>

          {/* Toolbar */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-2 rounded-md hover:bg-white"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-2 rounded-md hover:bg-white"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-2 rounded-md hover:bg-white"
              title="Underline"
            >
              <Underline size={16} />
            </button>

            <div className="mx-2 border-l h-5 border-gray-300" />

            <button
              type="button"
              onClick={() => exec("justifyLeft")}
              className="p-2 rounded-md hover:bg-white"
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyCenter")}
              className="p-2 rounded-md hover:bg-white"
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyRight")}
              className="p-2 rounded-md hover:bg-white"
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="min-h-[150px] p-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Use the toolbar above to format text.
            </p>
          </div>

          {/* Image Upload */}
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-lg border border-gray-200 p-2 bg-gray-50"
              />
            </div>
            <div className="w-40 h-28 rounded-lg border flex items-center justify-center overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="publishNow"
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="h-5 w-5 accent-indigo-600"
            />
            <label
              htmlFor="publishNow"
              className="font-medium text-gray-700 flex items-center gap-2"
            >
              <Check className="text-green-500" size={14} /> Publish Now
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add Blog
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}



