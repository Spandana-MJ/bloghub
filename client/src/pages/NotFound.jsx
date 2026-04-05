
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center
                    justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-indigo-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl
                   font-medium hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}