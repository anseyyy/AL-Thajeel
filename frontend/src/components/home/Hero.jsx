import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden isolate bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster=""
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 to-black/55" />
      <div className="text-center p-8 max-w-[680px]">
        <svg
          className="w-[84px] h-[84px] mx-auto mb-5.5 fill-[var(--gold)] animate-[reveal_1.1s_cubic-bezier(0.2,0.8,0.2,1)_both]"
          viewBox="0 0 26 26"
          aria-hidden="true"
        >
          <path d="M13 2 L24 12 H20 V23 H15 V15 H11 V23 H6 V12 H2 Z" />
        </svg>
        <h1 className="font-serif font-semibold text-[clamp(2.1rem,5.4vw,3.6rem)] mb-3 leading-[1.08] text-white animate-[rise_0.9s_0.3s_cubic-bezier(0.2,0.8,0.2,1)_both]">
          Find your place
          <br />
          in the UAE
        </h1>
        <p className="text-[1.05rem] text-[#EDE7DC] max-w-[540px] mx-auto mb-7 animate-[rise_0.9s_0.45s_cubic-bezier(0.2,0.8,0.2,1)_both]">
          Villas, flats, kiosks and warehouses across Dubai, Abu Dhabi and Sharjah
          — handled by a team that actually answers the phone.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap animate-[rise_0.9s_0.55s_cubic-bezier(0.2,0.8,0.2,1)_both]">
          <Link
            className="inline-block bg-[var(--gold)] text-[var(--gold-ink)] py-3.5 px-7 rounded-[2px] font-semibold text-[0.95rem] no-underline transition-all hover:brightness-105 active:scale-95"
            href="/properties"
          >
            View properties
          </Link>
          <Link
            className="inline-block bg-transparent border border-white text-white py-3.5 px-7 rounded-[2px] font-semibold text-[0.95rem] no-underline transition-all hover:bg-white/10 active:scale-95"
            href="/contact"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
}
