// File: src/app/layout.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import Link from "next/link";
import styles from "./Layout.module.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <DarkModeProvider>
          <AuthProvider>
            <Header />
            <main className={styles.main}>{children}</main>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}

// -----------------------------
// Header component
// -----------------------------
function Header() {
  const { user, logout, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        MealPlanner
      </Link>

      <nav className={styles.nav}>
        <button onClick={toggleDarkMode} className={styles.darkModeBtn}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span className={styles.welcome}>Hi, {user.email}</span>
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className={styles.navLink}>
              Log In
            </Link>
            <Link href="/auth/signup" className={styles.navLink}>
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
