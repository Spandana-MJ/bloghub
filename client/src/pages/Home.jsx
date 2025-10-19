
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public/blogs");
        setBlogs(res.data);
      } catch (err) {
         toast.error(" Failed to load blogs");
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-50 text-gray-900 font-sans">
      {/* 🔹 Hero Section */}
      <section className="max-w-6xl mx-auto text-center py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Discover Inspiring Stories & Ideas
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8"
        >
          Read insightful articles, explore developer journeys, and stay updated
          with the latest trends shaping the modern web.
        </motion.p>

        {/* 🌸 Modern Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* 🔹 Blog Cards Section */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.slice(0, 9).map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/blog/${blog._id}`}
                  className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  {blog.image && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/${blog.image}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-indigo-600 transition">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {blog.subtitle || blog.description?.slice(0, 80)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="text-indigo-600 font-medium">Read →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-base">
            No blogs found 😢
          </p>
        )}
      </main>
    </div>
  );
}

















