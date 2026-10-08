"use client";

import { useAuth } from "@/context/AuthContext";
import { LuLogOut } from "react-icons/lu";

export default function AdminTopbar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 sm:h-18 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(51,104,160,0.06)] border border-[rgba(51,104,160,0.16)] px-4 sm:px-6 m-4 flex items-center justify-between sticky top-4 z-20 transition-all font-sans">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#18324A] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: User Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-4 font-sans">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C8DFDB] text-[#3368A0] font-bold text-sm flex items-center justify-center border border-[#66A3BF]/30 shadow-xs shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          
          <div className="hidden md:block text-left min-w-0">
            <p className="text-[0.86rem] font-semibold text-[#18324A] truncate leading-tight">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[0.72rem] text-[#60788A] truncate font-medium">
              {user?.role === "admin" ? "Super Admin" : user?.role || "Staff"}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className="p-2 text-[#60788A] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Sign Out"
          >
            <LuLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
}
