
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    };
    fetchBlogs();
  }, []);

  const handlePublish = async (id) => {
    const token = sessionStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/blogs/${id}/publish`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBlogs(prev => prev.map(b => b._id === id ? { ...b, published: !b.published } : b));
  };

  const handleDelete = async (id) => {
     const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
     if (!confirmDelete) return;
      try {
    const token = sessionStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBlogs((prev) => prev.filter((b) => b._id !== id));
     toast.success("🗑️ Blog deleted successfully!");
  }catch(err){
    console.error(err);
    toast.error(" Error deleting blog!");
  }
};

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Blog List</h1>

      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-gray-200">
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
              <tr key={blog._id} className="hover:bg-gray-50 transition border-b border-gray-200">
                <td className="border p-3 text-center">{i + 1}</td>
                <td className="border p-3 font-medium text-gray-900">{blog.title}</td>
                <td className="border p-3 text-gray-600">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="border p-3 text-center">
                  {blog.published ? (
                    <span className="flex items-center gap-1 justify-center text-green-600 font-semibold">
                      <CheckCircle size={16} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 justify-center text-yellow-600 font-semibold">
                      <XCircle size={16} /> Unpublished
                    </span>
                  )}
                </td>
                <td className="border p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handlePublish(blog._id)}
                    className={`px-3 py-1 rounded-lg text-white transition font-medium ${blog.published ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-red-600 transition flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




