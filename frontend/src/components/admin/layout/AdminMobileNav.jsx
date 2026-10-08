"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { images } from "@/assets/images";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuStar,
  LuMail,
  LuLogOut,
  LuExternalLink,
  LuX,
} from "react-icons/lu";

export default function AdminMobileNav({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const isDashboardActive = pathname === "/admin/dashboard";
  const isPropertiesActive = pathname.startsWith("/admin/dashboard/properties");
  const isFeaturedActive = pathname.startsWith("/admin/dashboard/featured");
  const isInquiriesActive = pathname.startsWith("/admin/dashboard/inquiries");

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-[280px] max-w-[85vw] bg-[#3368A0] text-white flex flex-col justify-between p-6 shadow-2xl z-10 border-r border-[#285781]/40 animate-[rise_0.25s_ease-out]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1 shadow-xs">
                <img
                  src={images.logos.logo}
                  alt="Al Thajeel"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Al Thajeel
                </h3>
                <p className="text-[0.65rem] tracking-wider text-[#C8DFDB] uppercase font-bold">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close navigation"
            >
              <LuX className="text-xl" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 pt-6 font-sans">
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.92rem] transition-all ${
                isDashboardActive
                  ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                  : "text-white/90 hover:bg-[#66A3BF]/30 font-medium"
              }`}
            >
              <LuLayoutDashboard className="text-lg" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/dashboard/properties"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.92rem] transition-all ${
                isPropertiesActive
                  ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                  : "text-white/90 hover:bg-[#66A3BF]/30 font-medium"
              }`}
            >
              <LuBuilding2 className="text-lg" />
              <span>Properties</span>
            </Link>

            <Link
              href="/admin/dashboard/featured"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.92rem] transition-all ${
                isFeaturedActive
                  ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                  : "text-white/90 hover:bg-[#66A3BF]/30 font-medium"
              }`}
            >
              <LuStar className="text-lg" />
              <span>Featured Projects</span>
            </Link>

            <Link
              href="/admin/dashboard/inquiries"
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.92rem] transition-all ${
                isInquiriesActive
                  ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                  : "text-white/90 hover:bg-[#66A3BF]/30 font-medium"
              }`}
            >
              <LuMail className="text-lg" />
              <span>Inquiries & Leads</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl text-[0.92rem] text-white/80 hover:bg-white/10 mt-2 border-t border-white/10 pt-4"
            >
              <span className="flex items-center gap-3">
                <LuExternalLink className="text-lg" />
                <span>View Public Site</span>
              </span>
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-3 pt-6 border-t border-white/15">
          <div className="flex items-center gap-3 px-3 py-2 bg-[#285781] rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#C8DFDB] text-[#3368A0] font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[0.7rem] text-[#C8DFDB] truncate">
                {user?.email || "admin@althajeel.ae"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-black/15 hover:bg-red-600/90 border border-white/10 text-white text-xs font-semibold"
          >
            <LuLogOut className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
