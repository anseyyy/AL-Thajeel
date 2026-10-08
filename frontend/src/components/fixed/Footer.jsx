"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/common/Logo";

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="py-9 border-t border-[var(--line)] pb-[calc(2.2rem+env(safe-area-inset-bottom,0px))] bg-transparent w-full">
      <div className="container-width container-padding-x flex flex-wrap gap-4 justify-between items-center">
        <Logo isFooter={true} />
        <p className="text-[var(--sub)] text-[0.85rem] m-0">
          Office 1204, Business Bay, Dubai, UAE · +971 4 123 4567
        </p>
        <p className="text-[var(--sub)] text-[0.85rem] m-0">
          © 2026 Al Dhiyafah Properties
        </p>
      </div>
    </footer>
  );
}
