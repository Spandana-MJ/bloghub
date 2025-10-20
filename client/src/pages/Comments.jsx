
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

export default function Comments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await api.get("/api/comments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        toast.error(" Failed to load comments");
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await api.put(
        `/api/comments/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, approved: true } : c))
      );
      toast.success("Comment approved successfully!");
    } catch (err) {
      toast.error(" Failed to approve comment");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("token");
      await api.delete(`/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success("🗑️ Comment deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Comments
      </h1>

      <div className="bg-white shadow-2xl rounded-2xl overflow-x-auto border border-gray-200">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-indigo-50 text-indigo-900">
            <tr>
              <th className="border p-4">#</th>
              <th className="border p-4">Blog Title</th>
              <th className="border p-4">Name</th>
              <th className="border p-4">Comment</th>
              <th className="border p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c, i) => (
              <tr
                key={c._id}
                className="hover:bg-gray-50 transition border-b border-gray-200"
              >
                <td className="border p-3">{i + 1}</td>
                <td className="border p-3 font-medium text-gray-900">
                  {c.blogTitle}
                </td>
                <td className="border p-3 text-gray-700">{c.name}</td>
                <td className="border p-3 text-gray-700">{c.text}</td>
                <td className="border p-3 flex gap-2 justify-center">
                  {!c.approved && (
                    <button
                      onClick={() => handleApprove(c._id)}
                      className="bg-green-500 px-3 py-1 rounded-lg text-white hover:bg-green-600 flex items-center gap-1"
                    >
                      <Check size={16} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-8 font-medium"
                >
                  No comments available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
