"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCircleUser, LuX } from "react-icons/lu";
import Logo from "@/components/common/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  // Do not render public header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isInner = pathname !== "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 bg-transparent transition-colors duration-300">
        <div className="container-width container-padding-x flex items-center justify-between gap-3">
          
          {/* Mobile Left: Minimalist 2-line Hamburger Menu Button */}
          <div className="flex md:hidden items-center justify-start flex-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className={`flex flex-col justify-center gap-1.5 w-10 h-10 p-2 rounded-lg cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                isInner
                  ? "text-[var(--ink)]"
                  : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
              }`}
            >
              <span className="w-6 h-[2px] bg-current rounded-full" />
              <span className="w-4 h-[2px] bg-current rounded-full" />
            </button>
          </div>

          {/* Logo: Centered on Mobile, Left-aligned on Desktop */}
          <div className="flex items-center justify-center md:justify-start">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            id="mainNav"
            className="hidden md:flex items-center gap-[clamp(0.9rem,2.6vw,1.8rem)] flex-wrap"
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

          {/* Mobile Right: User / Profile Icon */}
          <div className="flex md:hidden items-center justify-end flex-1">
            <Link
              href="/contact"
              aria-label="Account Profile"
              className={`flex items-center justify-center w-10 h-10 p-2 rounded-full cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                isInner
                  ? "text-[var(--ink)]"
                  : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
              }`}
            >
              <LuCircleUser className="text-[1.55rem]" />
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-[290px] max-w-[85vw] bg-[var(--bg)] border-r border-[var(--line)] p-6 flex flex-col justify-between shadow-2xl z-50">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
                <span className="font-serif font-semibold text-[1.1rem] text-[var(--ink)]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-[var(--sub)] hover:text-[var(--ink)] rounded-lg cursor-pointer"
                >
                  <LuX className="text-xl" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex flex-col gap-2 pt-6">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-[1rem] font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--panel)] text-[var(--accent)] font-semibold"
                          : "text-[var(--ink)] hover:bg-[var(--panel)]/60"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer info */}
            <div className="pt-6 border-t border-[var(--line)]">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center bg-[var(--accent)] text-[var(--accent-ink)] py-3 px-4 rounded-[2px] font-semibold text-[0.92rem] no-underline transition-all hover:brightness-105"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
