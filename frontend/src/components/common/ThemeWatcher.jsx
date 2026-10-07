"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getPeriodFromHour(h) {
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

export default function ThemeWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    function syncTheme() {
      const theme = getPeriodFromHour(new Date().getHours());
      document.documentElement.setAttribute("data-theme", theme);
    }

    syncTheme();
    const interval = setInterval(syncTheme, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isInner = pathname !== "/";
    if (isInner) {
      document.body.classList.add("inner");
    } else {
      document.body.classList.remove("inner");
    }
  }, [pathname]);

  return null;
}
