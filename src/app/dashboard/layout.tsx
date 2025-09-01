// path: src/app/dashboard/layout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import styles from "./DashboardLayout.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Meal Planner Dashboard</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>
              Home
            </Link>
            <Link href="/dashboard/recipes" className={styles.navLink}>
              Recipes
            </Link>
            <Link href="/dashboard/shopping-lists" className={styles.navLink}>
              Shopping Lists
            </Link>
            <span onClick={handleLogout} className={styles.logout}>
              Logout
            </span>
          </nav>
        </header>

        {/* Main content */}
        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
