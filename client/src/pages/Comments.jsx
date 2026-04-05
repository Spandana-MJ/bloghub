
import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";
import ConfirmModal from "../components/ConfirmModal";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/comments");
        setComments(res.data);
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await api.put(`/api/comments/${id}/approve`, {});
      setComments(prev =>
        prev.map(c => c._id === id ? { ...c, approved: true } : c)
      );
      toast.success("Comment approved!");
    } catch (err) {
      toast.error("Failed to approve comment");
    } finally {
      setApprovingId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    try {
      await api.delete(`/api/comments/${deletingId}`);
      setComments(prev => prev.filter(c => c._id !== deletingId));
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error("Failed to delete comment");
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
          message="This will permanently delete the comment."
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowModal(false);
            setDeletingId(null);
          }}
        />
      )}

      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Comments
      </h1>

      <div className="bg-white shadow-2xl rounded-2xl 
                      overflow-x-auto border border-gray-200">
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
              <tr key={c._id}
                className="hover:bg-gray-50 transition border-b border-gray-200">
                <td className="border p-3">{i + 1}</td>
                <td className="border p-3 font-medium text-gray-900">
                  {c.blogTitle}
                </td>
                <td className="border p-3 text-gray-700">{c.name}</td>
                <td className="border p-3 text-gray-700">{c.text}</td>
                <td className="border p-3">
                  <div className="flex gap-2 justify-center">
                    {!c.approved && (
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={approvingId === c._id}
                        className="bg-green-500 px-3 py-1 rounded-lg text-white 
                                   hover:bg-green-600 flex items-center gap-1
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={16} />
                        {approvingId === c._id ? "Approving..." : "Approve"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(c._id)}
                      className="bg-red-500 px-3 py-1 rounded-lg text-white 
                                 hover:bg-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan="5"
                  className="text-center text-gray-500 py-8 font-medium">
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