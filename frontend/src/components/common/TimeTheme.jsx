"use client";

import { useEffect } from "react";

/**
 * Determines theme based on local browser time:
 * 06:00–17:59 (Day) → light
 * 18:00–05:59 (Night) → dark
 *
 * @param {Date} date
 * @returns {"light" | "dark"}
 */
export function getTimeTheme(date = new Date()) {
  const hours = date.getHours();
  // 6:00 AM to 5:59 PM is Day/Light mode
  if (hours >= 6 && hours < 18) {
    return "light";
  }
  // 6:00 PM to 5:59 AM is Night/Dark mode
  return "dark";
}

export function applyTheme(theme) {
  if (typeof document !== "undefined" && document.documentElement) {
    if (document.documentElement.getAttribute("data-theme") !== theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }
}

export default function TimeTheme() {
  useEffect(() => {
    function updateTheme() {
      const currentTheme = getTimeTheme(new Date());
      applyTheme(currentTheme);
    }

    // Apply immediately on mount
    updateTheme();

    // Check periodically so the theme shifts seamlessly as time passes
    const timer = setInterval(updateTheme, 10000);

    // Re-check whenever tab becomes visible or focused
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTheme();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", updateTheme);

    return () => {
      clearInterval(timer);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", updateTheme);
    };
  }, []);

  return null;
}
