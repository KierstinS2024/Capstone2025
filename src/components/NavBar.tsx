// path: src/components/NavBar.tsx
"use client";

/**
 * NavBar
 * ------
 * - Displays navigation links
 * - Adds a **single toggle button** that switches the **entire app** light/dark
 * - Includes logout button
 */

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      {/* Links */}
      <div className={styles.links}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/recipes">Recipes</Link>
        <Link href="/meal-plans">Meal Plans</Link>
        <Link href="/shopping-lists">Shopping Lists</Link>
        <Link href="/food-intake">Food Intake</Link>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.toggleButton}
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
