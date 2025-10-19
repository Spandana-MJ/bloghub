
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl tracking-wide hover:scale-105 transition transform">
          Blog<span className="text-yellow-300">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-xl font-medium hover:bg-indigo-100 transition"
            >
              <LogIn size={16} /> Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-500 text-white px-6 py-4 space-y-3 shadow-lg">
          

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-xl font-medium hover:bg-indigo-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={16} /> Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-1 bg-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}


