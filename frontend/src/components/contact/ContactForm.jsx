"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <input
        type="text"
        placeholder="Full name"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <input
        type="tel"
        placeholder="Phone (+971)"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <input
        type="email"
        placeholder="Email"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <textarea
        rows={4}
        placeholder="What are you looking for?"
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y placeholder:text-[var(--sub)]/70"
      />
      <button
        type="submit"
        disabled={status === "sent"}
        className="self-start bg-[var(--accent)] text-[var(--accent-ink)] border-none py-3.5 px-6.5 rounded-[2px] font-semibold cursor-pointer text-[0.92rem] transition-all hover:brightness-105 active:scale-95 disabled:opacity-85 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      >
        {status === "sent" ? "Sent — we will call you back" : "Send enquiry"}
      </button>
    </form>
  );
}
