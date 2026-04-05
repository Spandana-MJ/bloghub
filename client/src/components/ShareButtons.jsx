
import { Twitter, Linkedin, Link2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ShareButtons({ title, url }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center gap-3 my-6">
      <span className="text-sm font-medium text-gray-600">Share:</span>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-sky-500 text-white
                   px-3 py-1.5 rounded-lg text-sm hover:bg-sky-600
                   transition">
      
        <Twitter size={14} /> Twitter
      </a>

      {/* LinkedIn */}
      
      <a  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-blue-700 text-white
                   px-3 py-1.5 rounded-lg text-sm hover:bg-blue-800
                   transition"
      >
        <Linkedin size={14} /> LinkedIn
      </a>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="flex items-center gap-1 bg-gray-100 text-gray-700
                   px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200
                   transition border border-gray-300"
      >
        <Link2 size={14} /> Copy Link
      </button>
    </div>
  );
}