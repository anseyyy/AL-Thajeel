"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { images } from "@/assets/images";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuStar,
  LuQuote,
  LuMail,
  LuLogOut,
  LuExternalLink,
} from "react-icons/lu";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isDashboardActive = pathname === "/admin/dashboard";
  const isPropertiesActive = pathname.startsWith("/admin/dashboard/properties");
  const isFeaturedActive = pathname.startsWith("/admin/dashboard/featured");
  const isInquiriesActive = pathname.startsWith("/admin/dashboard/inquiries");

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between bg-[#3368A0] text-white rounded-2xl shadow-[0_10px_30px_rgba(51,104,160,0.15)] border border-[#285781]/40 p-5 my-4 ml-4 sticky top-4 h-[calc(100vh-2rem)] z-30 font-sans">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-white/15">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-xs shrink-0">
            <img
              src={images.logos.logo}
              alt="Al Thajeel"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-[1.05rem] font-bold tracking-tight text-white truncate">
              Al Thajeel
            </h2>
            <p className="text-[0.68rem] tracking-widest text-[#C8DFDB] uppercase font-bold">
              Real Estates Admin
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5 font-sans">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.9rem] transition-all duration-200 ${
              isDashboardActive
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                : "text-white/90 hover:text-white hover:bg-[#66A3BF]/30 font-medium"
            }`}
          >
            <LuLayoutDashboard className="text-lg shrink-0" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/dashboard/properties"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.9rem] transition-all duration-200 ${
              isPropertiesActive
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                : "text-white/90 hover:text-white hover:bg-[#66A3BF]/30 font-medium"
            }`}
          >
            <LuBuilding2 className="text-lg shrink-0" />
            <span>Properties</span>
          </Link>

          <Link
            href="/admin/dashboard/featured"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.9rem] transition-all duration-200 ${
              isFeaturedActive
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                : "text-white/90 hover:text-white hover:bg-[#66A3BF]/30 font-medium"
            }`}
          >
            <LuStar className="text-lg shrink-0" />
            <span>Featured Projects</span>
          </Link>

          <Link
            href="/admin/dashboard/testimonials"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.9rem] transition-all duration-200 ${
              pathname.startsWith("/admin/dashboard/testimonials")
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                : "text-white/90 hover:text-white hover:bg-[#66A3BF]/30 font-medium"
            }`}
          >
            <LuQuote className="text-lg shrink-0" />
            <span>Testimonials</span>
          </Link>

          <Link
            href="/admin/dashboard/inquiries"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[0.9rem] transition-all duration-200 ${
              isInquiriesActive
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-sm"
                : "text-white/90 hover:text-white hover:bg-[#66A3BF]/30 font-medium"
            }`}
          >
            <LuMail className="text-lg shrink-0" />
            <span>Inquiries & Leads</span>
          </Link>
        </nav>
      </div>

      {/* Footer / User & Logout */}
      <div className="space-y-3 pt-4 border-t border-white/15">
        {/* Quick link to live public site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-[0.82rem] transition-colors font-sans"
        >
          <span>View Public Site</span>
          <LuExternalLink className="text-sm opacity-80" />
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[#285781] rounded-xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#C8DFDB] text-[#3368A0] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.84rem] font-semibold text-white truncate font-sans">
              {user?.name || "Admin"}
            </p>
            <p className="text-[0.72rem] text-[#C8DFDB] truncate font-sans">
              {user?.email || "admin@althajeel.ae"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/15 hover:bg-red-600/90 border border-white/10 text-white text-[0.85rem] font-semibold transition-colors cursor-pointer font-sans"
        >
          <LuLogOut className="text-base" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
