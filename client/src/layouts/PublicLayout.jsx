import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-blue-50 p-6">
        <Outlet /> {/* Renders nested route component here */}
      </main>
    </>
  );
}
