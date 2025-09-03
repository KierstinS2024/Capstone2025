// src/app/dashboard/layout.tsx
"use client";

/**
 * DashboardLayout.tsx
 * -------------------
 * Wrapper layout for all dashboard pages.
 * Applies ProtectedRoute and consistent dashboard styling.
 */

import { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        {/* Future sidebar/header can be added here */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
