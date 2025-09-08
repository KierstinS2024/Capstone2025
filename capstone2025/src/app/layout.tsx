// src/app/layout.tsx
"use client";

/**
 * App Layout
 * Provides:
 *  - Global layout wrapper
 *  - Responsive NavBar with links
 *  - Dark/Light theme toggle
 *  - Mobile hamburger menu
 */

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { FiMenu, FiSun, FiMoon, FiX } from "react-icons/fi";
import "../styles/globals.css";

// -------------------- Theme Context --------------------
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook to access theme
export const useTheme = () => useContext(ThemeContext);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme to <html> and persist to localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* ------------------ NavBar ------------------ */}
        <nav className="flex justify-between items-center p-4 shadow-md bg-card sticky top-0 z-50">
          <Link href="/" className="font-bold text-xl">
            🍽️ MealPlanner
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center">
            {[
              "Dashboard",
              "Recipes",
              "Meal Plans",
              "Food Intake",
              "Shopping Lists",
              "Profile",
            ].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(" ", "-")}`}
              >
                {link}
              </Link>
            ))}

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 p-4 bg-card shadow-md">
            {[
              "Dashboard",
              "Recipes",
              "Meal Plans",
              "Food Intake",
              "Shopping Lists",
              "Profile",
            ].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </Link>
            ))}

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </div>
        )}

        {/* ------------------ Page Content ------------------ */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </ThemeContext.Provider>
  );
}
