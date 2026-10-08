"use client";

import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileBottomBar from "./AdminMobileBottomBar";
import "@/app/admin/admin.css";

export default function AdminLayout({ children, title = "Dashboard" }) {
  const { isLoading, isAuthenticated } = useAuth();

  // Authentication loading state
  if (isLoading) {
    return (
      <div className="admin-shell min-h-screen w-full bg-[#F2EFE7] flex flex-col items-center justify-center gap-4">
        {/* Al Thajeel Brand Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-1">
          <img
            src="/images/logo/althajeellogo.webp"
            alt="Al Thajeel Real Estates"
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        <div className="w-8 h-8 border-3 border-[#3368A0] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-base sm:text-lg text-[#18324A] font-medium tracking-wide">
          Loading Al Thajeel Admin...
        </p>
      </div>
    );
  }

  // If not authenticated, the AuthContext useEffect will handle redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#F2EFE7] flex flex-row relative text-[#18324A]">
      {/* Desktop Floating Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title={title} />

        <main className="flex-1 px-4 pb-24 lg:pb-8 pt-0 max-w-7xl w-full">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <AdminMobileBottomBar />
    </div>
  );
}

