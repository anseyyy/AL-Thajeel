import Link from "next/link";
import { images } from "@/assets/images";

export default function Logo({ isFooter = false }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center justify-center no-underline transition-opacity hover:opacity-90 
      }`}
    >
      {/* Mobile Stacked Logo */}
      <img
        src={images.logos.logo}
        alt="Al-Thajeel Real Estates"
        className={`block md:hidden object-contain ${
          isFooter ? "h-14 w-auto" : "h-34  sm:h-20 w-auto"
        }`}
      />

      {/* Desktop Horizontal Header Logo */}
      <img
        src={images.logos.headerLogo}
        alt="Al-Thajeel Real Estates"
        className={`hidden md:block object-contain ${
          isFooter ? "h-10 w-auto" : "h-14 w-auto"
        }`}
      />
    </Link>
  );
}
 