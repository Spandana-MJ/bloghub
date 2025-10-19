
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBlog from "./pages/AddBlog";
import BlogList from "./pages/BlogList";
import Comments from "./pages/Comments";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      {/* 🔔 Toast container for all pages */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin pages */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/blog-list" element={<BlogList />} />
          <Route path="/comments" element={<Comments />} />
        </Route>

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
