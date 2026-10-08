"use client";

import { useEffect } from "react";

/**
 * Determines theme based on local browser time:
 * 05:00–11:59 → morning
 * 12:00–16:59 → afternoon
 * 17:00–19:59 → evening
 * 20:00–04:59 → night
 *
 * @param {Date} date
 * @returns {"morning" | "afternoon" | "evening" | "night"}
 */
export function getTimeTheme(date = new Date()) {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return "morning";
  }
  if (hours >= 12 && hours < 17) {
    return "afternoon";
  }
  if (hours >= 17 && hours < 20) {
    return "evening";
  }
  return "night";
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
