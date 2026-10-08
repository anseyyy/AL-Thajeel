"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'sent' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await api.public.submitContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });

      if (res.success) {
        setStatus("sent");
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again or reach out directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full name"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone (+971)"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--sub)]/70"
      />
      <textarea
        rows={4}
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="What are you looking for?"
        className="font-sans text-[0.92rem] p-3 px-3.5 border border-[var(--line)] rounded-[2px] bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y placeholder:text-[var(--sub)]/70"
      />

      {status === "error" && (
        <div className="p-3 rounded-[2px] bg-red-50 text-red-700 text-xs font-sans border border-red-200">
          {errorMessage}
        </div>
      )}

      {status === "sent" && (
        <div className="p-3.5 rounded-[2px] bg-[var(--panel)] text-[var(--ink)] text-xs font-sans border border-[var(--accent)] leading-relaxed">
          ✓ Thank you for reaching out. Your enquiry has been received and our advisors will contact you shortly.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start bg-[var(--accent)] text-[var(--accent-ink)] border-none py-3.5 px-6.5 rounded-[2px] font-semibold cursor-pointer text-[0.92rem] transition-all hover:brightness-105 active:scale-95 disabled:opacity-85 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 flex items-center gap-2"
      >
        {status === "submitting" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}

