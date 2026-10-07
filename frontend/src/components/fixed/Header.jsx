"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isInner = pathname !== "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between flex-wrap gap-3 px-[clamp(1.2rem,4vw,3rem)] pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-4 bg-transparent transition-colors duration-300">
      <Logo />
      <nav
        id="mainNav"
        className="flex items-center gap-[clamp(0.9rem,2.6vw,1.8rem)] flex-wrap"
        aria-label="Main Navigation"
      >
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.92rem] cursor-pointer transition-all duration-200 no-underline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
                isInner
                  ? isActive
                    ? "text-[var(--ink)] font-semibold opacity-100"
                    : "text-[var(--sub)] opacity-90 hover:text-[var(--ink)] hover:opacity-100"
                  : isActive
                  ? "text-white font-semibold opacity-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
                  : "text-white opacity-90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
