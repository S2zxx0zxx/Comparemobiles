"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem("cm-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = stored ?? (preferred ? "dark" : "light");
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("cm-theme", next);
  }

  return (
    <button className="icon-button" type="button" onClick={toggle} aria-label="Toggle color theme">
      <Moon size={16} className="theme-icon theme-icon-light" />
      <Sun size={16} className="theme-icon theme-icon-dark" />
    </button>
  );
}
