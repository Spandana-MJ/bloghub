import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handlePublish = async (id) => {
    try {
      const res = await api.put(`/api/blogs/${id}/publish`, {});
      // Use server response to stay in sync
      setBlogs(prev =>
        prev.map(b => b._id === id ? { ...b, published: res.data.published } : b)
      );
      toast.success("Blog status updated!");
    } catch (err) {
      toast.error("Failed to update blog status");
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    try {
      await api.delete(`/api/blogs/${deletingId}`);
      setBlogs(prev => prev.filter(b => b._id !== deletingId));
      toast.success("Blog deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
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
    <div className="p-8 bg-gray-50 min-h-screen">
      {showModal && (
        <ConfirmModal
          message="This will permanently delete the blog and cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowModal(false);
            setDeletingId(null);
          }}
        />
      )}

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Blog List
      </h1>

      <div className="bg-white shadow-2xl rounded-2xl 
                      overflow-x-auto border border-gray-200">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-indigo-50 text-indigo-900">
            <tr>
              <th className="border p-4">#</th>
              <th className="border p-4">Title</th>
              <th className="border p-4">Date</th>
              <th className="border p-4">Status</th>
              <th className="border p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-50 transition 
                           border-b border-gray-200"
              >
                <td className="border p-3 text-center">{i + 1}</td>
                <td className="border p-3 font-medium text-gray-900">
                  {blog.title}
                </td>
                <td className="border p-3 text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-3 text-center">
                  {blog.published ? (
                    <span className="flex items-center gap-1 justify-center 
                                     text-green-600 font-semibold">
                      <CheckCircle size={16} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 justify-center 
                                     text-yellow-600 font-semibold">
                      <XCircle size={16} /> Unpublished
                    </span>
                  )}
                </td>
                <td className="border p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/edit-blog/${blog._id}`)}
                      className="bg-blue-500 px-3 py-1 rounded-lg text-white 
                                 hover:bg-blue-600 flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handlePublish(blog._id)}
                      className={`px-3 py-1 rounded-lg text-white transition 
                                  font-medium ${blog.published
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog._id)}
                      className="bg-red-500 px-3 py-1 rounded-lg text-white 
                                 hover:bg-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5"
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