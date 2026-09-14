import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminFooter from "../components/layout/AdminFooter";
import AdminHeader from "../components/layout/AdminHeader";
import AdminSidebar from "../components/layout/AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    /*
      عند ربط Auth الحقيقي:
      authService.logout()
      ثم redirect للـfrontend login.
    */

    navigate("/");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f8fa] text-slate-900"
    >
      <AdminHeader
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen flex-col pt-16 lg:mr-[270px]">
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}