
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import BackToTop from "../components/BackToTop";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-blue-50">
        <Outlet />
      </main>
      <Footer />
        <BackToTop /> 
    </div>
  );
}