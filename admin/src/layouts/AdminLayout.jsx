import { useState } from "react";
import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import AdminFooter from "../components/layout/AdminFooter";
import AdminHeader from "../components/layout/AdminHeader";
import AdminSidebar from "../components/layout/AdminSidebar";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import {
  useAdminAuth,
} from "../features/auth/context/useAdminAuth";

export default function AdminLayout() {
  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const [
    isLogoutConfirmOpen,
    setIsLogoutConfirmOpen,
  ] = useState(false);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const navigate =
    useNavigate();

  const {
    logout,
  } = useAdminAuth();

  const handleRequestLogout =
    () => {
      if (isLoggingOut) {
        return;
      }

      setIsSidebarOpen(false);
      setIsLogoutConfirmOpen(true);
    };

  const handleCancelLogout =
    () => {
      if (isLoggingOut) {
        return;
      }

      setIsLogoutConfirmOpen(false);
    };

  const handleConfirmLogout =
    async () => {
      if (isLoggingOut) {
        return;
      }

      setIsLoggingOut(true);

      try {
        await logout();

        setIsLogoutConfirmOpen(false);

        navigate(
          "/login",
          {
            replace: true,
          },
        );
      } finally {
        setIsLoggingOut(false);
      }
    };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f8fa] text-slate-900"
    >
      <AdminHeader
        onOpenSidebar={() =>
          setIsSidebarOpen(true)
        }
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() =>
          setIsSidebarOpen(false)
        }
        onLogout={handleRequestLogout}
      />

      <div className="flex min-h-screen flex-col pt-16 lg:mr-[270px]">
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

        <AdminFooter />
      </div>

      <ConfirmDialog
        isOpen={
          isLogoutConfirmOpen
        }
        onClose={
          handleCancelLogout
        }
        onConfirm={
          handleConfirmLogout
        }
        title="تسجيل الخروج"
        description="هل تود تسجيل الخروج بالفعل؟"
        confirmText={
          isLoggingOut
            ? "جاري تسجيل الخروج..."
            : "نعم، تسجيل الخروج"
        }
        cancelText="لا، أريد البقاء في الصفحة"
      />
    </div>
  );
}