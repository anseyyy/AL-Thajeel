"use client";

import Link from "next/link";
import Image from "next/image";
import images from "@/assets/images";

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

      <div className="relative flex items-center justify-center px-[clamp(1.2rem,4vw,2rem)] w-full">
        <Image
          src={images.logos.logo}
          alt="Al-Thajeel Real Estates"
          width={320}
          height={320}
          priority
          className="w-[120px] h-auto md:w-[250px] opacity-0 motion-safe:animate-[logoReveal_7.6s_both] motion-reduce:hidden"
        />
      </div>
    </div>
  );
}
