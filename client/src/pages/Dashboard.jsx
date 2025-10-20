
import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ blogs: 0, comments: 0 });
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const blogsRes = await api.get("/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const commentsRes = await api.get("/api/comments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCounts({ blogs: blogsRes.data.length, comments: commentsRes.data.length });
        setBlogs(blogsRes.data);
      } catch (err) {
        toast.error(" Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const handlePublish = async (id) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.put(
        `/api/blogs/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, published: !b.published } : b
        )
      );
      toast.success(" Blog status updated!");
    } catch {
      toast.error(" Failed to update blog status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const token = sessionStorage.getItem("token");
    try {
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("🗑️ Blog deleted successfully!");
    } catch {
      toast.error(" Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 text-center">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FileText className="text-indigo-600" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Total Blogs</h3>
            <p className="text-3xl font-bold text-indigo-600">{counts.blogs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <MessageCircle className="text-green-500" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Total Comments</h3>
            <p className="text-3xl font-bold text-green-500">{counts.comments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-center gap-4">
          <CheckCircle className="text-yellow-500" size={36} />
          <div>
            <h3 className="text-gray-500 font-medium">Published Blogs</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {blogs.filter((b) => b.published).length}
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
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-100 border-b border-gray-200 transition"
              >
                <td className="p-4 text-center">{i + 1}</td>
                <td className="p-4 text-gray-900">{blog.title}</td>
                <td className="p-4 text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  {blog.published ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center justify-center gap-1">
                      <CheckCircle size={16} /> Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center justify-center gap-1">
                      <XCircle size={16} /> Draft
                    </span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => handlePublish(blog._id)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-8 font-medium"
                >
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
