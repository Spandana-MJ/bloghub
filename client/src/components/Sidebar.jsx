
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, FilePlus, List, MessageSquare, LogOut, Menu, X, Users, BarChart2 } from "lucide-react";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition ${
      location.pathname === path ? "bg-indigo-200 text-indigo-700 font-semibold" : "text-gray-700"
    }`;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white shadow-lg h-screen p-4 flex flex-col justify-between transition-all duration-300 sticky top-0`}
      >
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 mb-6 text-gray-700 hover:text-indigo-600 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
            {isOpen && <span className="font-bold text-xl">Admin Panel</span>}
          </button>

          <nav className="space-y-2">
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              <LayoutDashboard size={22} />
              {isOpen && "Dashboard"}
            </Link>
            <Link to="/add-blog" className={linkClasses("/add-blog")}>
              <FilePlus size={22} />
              {isOpen && "Add Blog"}
            </Link>
            <Link to="/blog-list" className={linkClasses("/blog-list")}>
              <List size={22} />
              {isOpen && "Blog List"}
            </Link>
            <Link to="/comments" className={linkClasses("/comments")}>
              <MessageSquare size={22} />
              {isOpen && "Comments"}
            </Link>
           
            
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg text-white transition"
        >
          <LogOut size={22} />
          {isOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen p-6 overflow-auto">{children}</main>
    </div>
  );
}
