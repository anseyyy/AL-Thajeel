"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import {
  LuChevronLeft,
  LuChevronRight,
  LuStar,
  LuUser,
} from "react-icons/lu";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef(null);

  // Fetch published testimonials from backend API
  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      try {
        const res = await api.public.getTestimonials({ limit: 12 });
        if (isMounted && res.success && Array.isArray(res.data)) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = testimonials.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Subtle auto-slide (5 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    autoSlideRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [total, isPaused, handleNext]);

  // Helper to format date as MM/DD/YYYY (e.g. 09/30/2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return "09/30/2026";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "09/30/2026";
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-[var(--bg)] border-b border-[var(--line)] transition-colors duration-500">
        <div className="container-width container-padding-x">
          <div className="mb-12">
            <div className="w-28 h-7 bg-[var(--line)]/60 rounded-full animate-pulse mb-4" />
            <div className="w-80 sm:w-96 h-10 bg-[var(--line)] rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[380px] rounded-[26px] bg-[var(--panel)] border border-[var(--line)] p-7 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Graceful empty state: return null if no published testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Helper to get visible items for responsive 3-column carousel
  const getVisibleItems = () => {
    if (total === 0) return [];
    if (total === 1) return [{ item: testimonials[0], position: 0 }];
    if (total === 2) {
      return [
        { item: testimonials[currentIndex % total], position: 0 },
        { item: testimonials[(currentIndex + 1) % total], position: 1 },
      ];
    }

    return [
      { item: testimonials[currentIndex % total], position: 0 },
      { item: testimonials[(currentIndex + 1) % total], position: 1 },
      { item: testimonials[(currentIndex + 2) % total], position: 2 },
    ];
  };

  const visibleCards = getVisibleItems();

  return (
    <section
      className="py-15 bg-[var(--bg)] border-b border-[var(--line)] transition-colors duration-500 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-width container-padding-x">
        {/* Section Header with Pill Badge & 2-Tone Heading */}
        <div className="mb-12 sm:mb-16">
          {/* Top Pill Badge */}
          {/* <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)] text-[0.8rem] font-medium text-[var(--ink)] shadow-xs mb-4">
            Testimonial
          </div> */}

          {/* 2-Tone Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)] leading-[1.15] max-w-2xl font-sans">
            Chosen by 14k+ growing{" "}
            <span className="text-[var(--sub)] font-normal block sm:inline">
              businesses worldwide!
            </span>
          </h2>
        </div>

        {/* Carousel Container with Integrated Rounded Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow (Circular Rounded Button matching theme) */}
          {total > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <LuChevronLeft className="text-xl" />
            </button>
          )}

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {visibleCards.map(({ item }, idx) => {
              const formattedDate = formatDate(item.date);

              return (
                <div
                  key={`${item._id}-${idx}`}
                  className="rounded-[26px] bg-[var(--panel)] border border-[var(--line)] shadow-xs p-7 sm:p-8 flex flex-col justify-between min-h-[380px] transition-colors duration-300 hover:border-[var(--accent)]/35 relative group"
                >
                  {/* Top Header: Avatar, Name & Role */}
                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border-0 outline-none"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--accent)] flex items-center justify-center shrink-0">
                          <LuUser className="text-xl" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[1.05rem] text-[var(--ink)] leading-snug truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[var(--sub)] truncate mt-0.5 font-normal">
                          {item.role || "Verified Client"}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial Quote Message */}
                    <p className="text-[0.95rem] text-[var(--ink)] leading-relaxed font-normal pt-2 font-sans">
                      "{item.message}"
                    </p>
                  </div>

                  {/* Bottom Row: 5 Gold Stars & Formatted Date */}
                  <div className="flex items-center justify-between pt-5 border-t border-[var(--line)] mt-6">
                    <div
                      className="flex items-center gap-1"
                      aria-label={`Rating: ${item.rating || 5} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (item.rating || 5);
                        return (
                          <LuStar
                            key={star}
                            className={`text-sm ${
                              isFilled
                                ? "fill-[var(--gold)] text-[var(--gold)]"
                                : "text-[var(--line)] fill-transparent"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-[var(--sub)] font-mono tracking-tight">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow (Circular Rounded Button matching theme) */}
          {total > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <LuChevronRight className="text-xl" />
            </button>
          )}
        </div>

        {/* Mobile Pagination Indicator Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 md:hidden">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex % total === i
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-[var(--line)]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
