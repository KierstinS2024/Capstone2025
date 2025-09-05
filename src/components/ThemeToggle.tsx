// src/components/ThemeToggle.tsx

"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        backgroundColor: theme === "dark" ? "#4c566a" : "#a3be8c",
        color: theme === "dark" ? "#eceff4" : "#2e3440",
        zIndex: 1000,
      }}
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
