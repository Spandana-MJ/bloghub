import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-blue-50 min-h-screen p-6">
        <Outlet /> {/* Nested admin page */}
      </main>
    </div>
  );
}
