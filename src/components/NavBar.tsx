// path: src/components/NavBar.tsx
"use client";

/**
 * NavBar
 * ------
 * - Displays main app navigation links
 * - Provides a dark/light mode toggle using ThemeContext
 * - Includes a logout button from AuthContext
 *
 * Notes:
 * - Links highlight on hover
 * - Dark/light mode toggle updates global CSS variables via ThemeContext
 * - Buttons have accessible labels and consistent styling
 */

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import styles from "./NavBar.module.css";

export default function NavBar() {
  // Get auth methods
  const { logout } = useAuth();

  // Get current theme and toggle function
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      {/* Navigation Links */}
      <div className={styles.links}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/recipes">Recipes</Link>
        <Link href="/meal-plans">Meal Plans</Link>
        <Link href="/shopping-lists">Shopping Lists</Link>
        <Link href="/food-intake">Food Intake</Link>
      </div>

      {/* Action Buttons: Theme toggle + Logout */}
      <div className={styles.actions}>
        {/* Dark/Light toggle */}
        <button
          className={styles.toggleButton}
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>

        {/* Logout */}
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
