import Link from "next/link";

export default function Logo({ isFooter = false }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 font-serif font-semibold text-[var(--gold)] no-underline transition-opacity hover:opacity-90 ${
        isFooter
          ? "text-[1rem] drop-shadow-none"
          : "text-[1.2rem] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] group-[.inner]/body:drop-shadow-none"
      }`}
    >
      <svg
        className={`shrink-0 fill-[var(--gold)] ${
          isFooter ? "w-5 h-5" : "w-[26px] h-[26px]"
        }`}
        viewBox="0 0 26 26"
        aria-hidden="true"
      >
        <path d="M13 2 L24 12 H20 V23 H15 V15 H11 V23 H6 V12 H2 Z" />
      </svg>
      Al Dhiyafah
    </Link>
  );
}
