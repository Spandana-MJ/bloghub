
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(
          `/api/public/blogs/${id}`
        );
        setBlog(res.data.blog);
        setComments(res.data.comments);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog details!");
      }
    };
    fetchBlog();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/public/blogs/${id}/comments`, {
        name,
        text,
      });
      toast.success("Comment submitted for approval!");
      setName("");
      setText("");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting comment");
    }
  };

  if (!blog) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        {blog.image && (
          <img
            // src={`/uploads/${blog.image}`}
             src={blog.image}
            alt={blog.title}
            className="w-full h-60 object-cover"
          />
        )}

        <div className="p-8">
          <Link
            to="/"
            className="text-indigo-600 hover:underline text-sm font-medium inline-block mb-4"
          >
            ← Back to Blogs
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h1>
          <p className="text-gray-600 mb-4 italic">{blog.subtitle}</p>
          <p className="text-sm text-gray-500 mb-6">
            Published on {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          <div
            className="text-gray-800 leading-relaxed mb-8 prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.description),
            }}
          />

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Comments
            </h2>

            <div className="max-h-40 overflow-y-auto mb-4 space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-gray-50 border rounded-lg p-2 text-sm shadow-sm"
                  >
                    <strong className="text-gray-800">{c.name}: </strong>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(c.text),
                      }}
                    />
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleComment} className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                rows="2"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                Add Comment
              </button>
            </form>
          </div>
        </div>
      </motion.div>
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
