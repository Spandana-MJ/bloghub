
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { calculateReadingTime } from "../utils/readingTime";
import ShareButtons from "../components/ShareButtons";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Reading progress bar
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0
          ? Math.round((scrollTop / docHeight) * 100)
          : 0;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    // Run once immediately to set initial value
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/public/blogs/${id}`);
        setBlog(res.data.blog);
        setComments(res.data.comments);

        // Fetch related blogs
        if (res.data.blog?.category) {
          const allRes = await api.get("/api/public/blogs");

          // Handle both response formats
          const blogsArray = Array.isArray(allRes.data)
            ? allRes.data
            : allRes.data.blogs || [];

          const related = blogsArray
            .filter(
              (b) =>
                b.category === res.data.blog.category &&
                b._id !== id
            )
            .slice(0, 3);

          setRelatedBlogs(related);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog details!");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Set like state from localStorage when blog loads
  useEffect(() => {
    if (blog) {
      setLikeCount(blog.likes || 0);
      const likedBlogs = JSON.parse(
        localStorage.getItem("likedBlogs") || "[]"
      );
      setLiked(likedBlogs.includes(id));
    }
  }, [blog, id]);

  // Handle like/unlike
  const handleLike = async () => {
    const likedBlogs = JSON.parse(
      localStorage.getItem("likedBlogs") || "[]"
    );
    try {
      if (liked) {
        await api.put(`/api/public/blogs/${id}/unlike`);
        setLikeCount((prev) => Math.max(prev - 1, 0));
        setLiked(false);
        localStorage.setItem(
          "likedBlogs",
          JSON.stringify(likedBlogs.filter((b) => b !== id))
        );
      } else {
        await api.put(`/api/public/blogs/${id}/like`);
        setLikeCount((prev) => prev + 1);
        setLiked(true);
        localStorage.setItem(
          "likedBlogs",
          JSON.stringify([...likedBlogs, id])
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update like. Please try again.");
    }
  };

  // Handle comment submit
  const handleComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
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

  if (!blog) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Blog not found.
      </p>
    );
  }

  return (
    <>
      {/* Reading Progress Bar — above everything including navbar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-150
                     rounded-r-full"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-100
                      to-white flex items-center justify-center
                      px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full bg-white rounded-3xl shadow-xl
                     border border-gray-100"
          // Removed overflow-hidden — it was clipping the progress bar
        >
          {/* Blog Image */}
          <div className="overflow-hidden rounded-t-3xl">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-60 object-cover"
              />
            ) : (
              <div className="w-full h-60 bg-gradient-to-br
                              from-indigo-100 to-purple-100
                              flex items-center justify-center">
                <span className="text-6xl">📝</span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Back Link */}
            <Link
              to="/"
              className="text-indigo-600 hover:underline text-sm
                         font-medium inline-block mb-4"
            >
              ← Back to Blogs
            </Link>

            {/* Category Badge */}
            {blog.category && (
              <span className="inline-block bg-indigo-50
                               text-indigo-600 text-xs font-medium
                               px-3 py-1 rounded-full mb-3 ml-2">
                {blog.category}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {blog.title}
            </h1>

            <p className="text-gray-600 mb-4 italic">
              {blog.subtitle}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3
                            text-sm text-gray-500 mb-4">
              <span>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>
                {calculateReadingTime(blog.description)} min read
              </span>
              <span>•</span>
              <span>{blog.views || 0} views</span>
            </div>

            {/* Share + Like row */}
            <div className="flex flex-wrap items-center
                            justify-between gap-4 mb-6">
              <ShareButtons
                title={blog.title}
                url={window.location.href}
              />

              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2
                            rounded-full border transition
                            font-medium text-sm
                            ${liked
                    ? "bg-red-50 border-red-300 text-red-500"
                    : "bg-white border-gray-300 text-gray-600 hover:border-red-300"
                  }`}
              >
                <span className="text-lg">
                  {liked ? "❤️" : "🤍"}
                </span>
                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
              </button>
            </div>

            {/* Blog Content */}
            <div
              className="text-gray-800 leading-relaxed mb-8
                         prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blog.description),
              }}
            />

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="border-t pt-8 mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Related Articles
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedBlogs.map((related) => (
                    <Link
                      key={related._id}
                      to={`/blog/${related._id}`}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="block bg-gray-50 rounded-xl
                                 overflow-hidden border border-gray-100
                                 hover:shadow-md transition"
                    >
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-28 object-cover"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gradient-to-br
                                        from-indigo-100 to-purple-100
                                        flex items-center justify-center">
                          <span className="text-2xl">📝</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold
                                       text-gray-800 line-clamp-2 mb-1">
                          {related.title}
                        </h3>
                        <span className="text-xs text-indigo-600">
                          Read →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-6 mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Comments
              </h2>

              <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="bg-gray-50 border rounded-lg
                                 p-3 text-sm"
                    >
                      <strong className="text-gray-800">
                        {c.name}:{" "}
                      </strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(c.text),
                        }}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleComment} className="space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300
                             rounded-lg text-sm focus:ring-2
                             focus:ring-indigo-500 outline-none"
                  required
                />
                <textarea
                  placeholder="Write a comment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border border-gray-300
                             rounded-lg text-sm focus:ring-2
                             focus:ring-indigo-500 outline-none"
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-2
                             rounded-lg font-medium hover:bg-indigo-700
                             transition disabled:opacity-50
                             disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Add Comment"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}