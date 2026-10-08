"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuStar,
  LuQuote,
  LuMail,
} from "react-icons/lu";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LuLayoutDashboard,
    isActive: (pathname) => pathname === "/admin/dashboard",
  },
  {
    label: "Properties",
    href: "/admin/dashboard/properties",
    icon: LuBuilding2,
    isActive: (pathname) => pathname.startsWith("/admin/dashboard/properties"),
  },
  {
    label: "Featured",
    href: "/admin/dashboard/featured",
    icon: LuStar,
    isActive: (pathname) => pathname.startsWith("/admin/dashboard/featured"),
  },
  {
    label: "Reviews",
    href: "/admin/dashboard/testimonials",
    icon: LuQuote,
    isActive: (pathname) => pathname.startsWith("/admin/dashboard/testimonials"),
  },
  {
    label: "Inquiries",
    href: "/admin/dashboard/inquiries",
    icon: LuMail,
    isActive: (pathname) => pathname.startsWith("/admin/dashboard/inquiries"),
  },
];

export default function AdminMobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#3368A0] text-white rounded-2xl shadow-[0_12px_35px_rgba(51,104,160,0.35)] border border-[#285781]/40 px-2 py-1.5 flex items-center justify-around font-sans"
    >
      {navItems.map((item) => {
        const active = item.isActive(pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 rounded-xl text-[0.72rem] transition-all duration-200 no-underline cursor-pointer min-w-[62px] ${
              active
                ? "bg-[#C8DFDB] text-[#3368A0] font-bold shadow-xs scale-105"
                : "text-white/80 hover:text-white hover:bg-white/10 font-medium"
            }`}
          >
            <Icon className={`text-lg mb-0.5 ${active ? "text-[#3368A0]" : "text-white"}`} />
            <span className="tracking-tight leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
