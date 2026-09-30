"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("cm-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : preferred;
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("cm-theme", next ? "dark" : "light");
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label="Toggle color theme">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
