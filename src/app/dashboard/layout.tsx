// path: src/app/dashboard/layout.tsx

"use client";

import { ReactNode, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./DashboardLayout.module.css"; // dashboard-specific styles

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout
 *
 * Wraps all /dashboard routes with ProtectedRoute.
 * Provides dashboard navigation (header + nav links).
 * Logout is handled via AuthContext.logout().
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useContext(AuthContext);

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
            <span onClick={logout} className={styles.logout}>
              Logout
            </span>
          </nav>
        </header>

        {/* Main Content */}
        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
