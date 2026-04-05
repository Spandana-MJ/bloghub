
import { useEffect, useState } from "react";
import {
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const blogsRes = await api.get("/api/blogs");
        const commentsRes = await api.get("/api/comments");
        setBlogs(blogsRes.data);
        setCommentCount(commentsRes.data.length);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total views across all blogs
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const publishedCount = blogs.filter((b) => b.published).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10
                        border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 text-center">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2
                      lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg
                        transition flex items-center gap-4">
          <FileText className="text-indigo-600" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Total Blogs</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {blogs.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg
                        transition flex items-center gap-4">
          <MessageCircle className="text-green-500" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Total Comments</h3>
            <p className="text-3xl font-bold text-green-500">
              {commentCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg
                        transition flex items-center gap-4">
          <CheckCircle className="text-yellow-500" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Published</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {publishedCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg
                        transition flex items-center gap-4">
          <Eye className="text-purple-500" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Total Views</h3>
            <p className="text-3xl font-bold text-purple-500">
              {totalViews}
            </p>
          </div>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-indigo-50 text-indigo-900">
            <tr>
              <th className="p-4 font-semibold">#</th>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Views</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-100 border-b
                           border-gray-200 transition"
              >
                <td className="p-4 text-center">{i + 1}</td>
                <td className="p-4 text-gray-900 font-medium">
                  {blog.title}
                </td>
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-600
                                   text-xs px-2 py-1 rounded-full">
                    {blog.category || "Other"}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-center">
                  {blog.views || 0}
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {blog.published ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1
                                     rounded-full text-sm font-semibold
                                     flex items-center gap-1 w-fit">
                      <CheckCircle size={14} /> Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1
                                     rounded-full text-sm font-semibold
                                     flex items-center gap-1 w-fit">
                      <XCircle size={14} /> Draft
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="6"
                  className="text-center text-gray-500 py-8 font-medium">
                  No blogs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
