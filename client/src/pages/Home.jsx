

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import { calculateReadingTime } from "../utils/readingTime";

const CATEGORIES = [
  "All",
  "Technology",
  "Lifestyle",
  "Travel",
  "Food",
  "Health",
  "Business",
  "Other",
];

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const blogsPerPage = 6;

  

  useEffect(() => {
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/public/blogs");
      setBlogs(res.data.blogs || []);  // ← change res.data to res.data.blogs
    } catch (err) {
      toast.error("Failed to load blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchBlogs();
}, []);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Filter by search and category
  const filtered = blogs.filter((b) => {
    const matchesSearch = b.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / blogsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const goToPrev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white
                    via-gray-50 to-indigo-50 text-gray-900 font-sans">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     bg-clip-text text-transparent"
        >
          Discover Inspiring Stories & Ideas
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-base md:text-lg
                     max-w-2xl mx-auto mb-8"
        >
          Read insightful articles, explore developer journeys, and stay
          updated with the latest trends shaping the modern web.
        </motion.p>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border
                         border-gray-200 rounded-full shadow-sm
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:border-transparent
                         transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium
                          transition border
                          ${selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Cards Section */}
      <main className="max-w-6xl mx-auto px-6 pb-16">

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10
                            border-4 border-indigo-500
                            border-t-transparent" />
          </div>

        ) : paginated.length > 0 ? (
          <>
            {/* Blog Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={`/blog/${blog._id}`}
                    className="block bg-white rounded-2xl shadow-md
                               hover:shadow-xl transition duration-300
                               overflow-hidden border border-gray-100
                               hover:-translate-y-1 h-full"
                  >
                    {/* Blog Image or Placeholder */}
                    {blog.image ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover
                                     hover:scale-105 transition-transform
                                     duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br
                                      from-indigo-100 to-purple-100
                                      flex items-center justify-center">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Category Badge */}
                      {blog.category && (
                        <span className="inline-block bg-indigo-50
                                         text-indigo-600 text-xs font-medium
                                         px-2 py-1 rounded-full mb-2">
                          {blog.category}
                        </span>
                      )}

                      <h3 className="text-lg font-semibold mb-2
                                     text-gray-800 hover:text-indigo-600
                                     transition line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {/* {blog.subtitle ||
                          blog.description?.slice(0, 80)}... */}
                            {blog.subtitle
            ? blog.subtitle
            : stripHtml(blog.description).slice(0, 120)
                            }
                      </p>

                      <div className="flex justify-between items-center
                                      text-xs text-gray-500">
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          {calculateReadingTime(blog.description)} min read
                        </span>
                        <span className="text-indigo-600 font-medium">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center
                              gap-4 mt-12">
                <button
                  onClick={goToPrev}
                  disabled={currentPage === 1}
                  className="px-5 py-2 rounded-full border border-gray-300
                             text-gray-700 font-medium hover:bg-gray-100
                             transition disabled:opacity-40
                             disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-9 h-9 rounded-full font-medium
                                    transition text-sm
                                    ${currentPage === page
                            ? "bg-indigo-600 text-white shadow"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2 rounded-full border border-gray-300
                             text-gray-700 font-medium hover:bg-gray-100
                             transition disabled:opacity-40
                             disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Page Info */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Page {currentPage} of {totalPages} —
              showing {paginated.length} of {filtered.length} blogs
            </p>
          </>

        ) : (
          <p className="text-center text-gray-500 mt-10 text-base">
            No blogs found 😢
          </p>
        )}
      </main>
    </div>
  );
}










