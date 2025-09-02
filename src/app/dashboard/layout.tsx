// src/app/dashboard/layout.tsx
"use client";

/**
 * DashboardLayout
 *
 * Wraps all dashboard pages with:
 * - ProtectedRoute (ensures only logged-in users can access)
 * - Common layout styling (header, main content area)
 */

import { ReactNode, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div className={styles.layoutContainer}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          {user && (
            <div className={styles.userActions}>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutButton} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
