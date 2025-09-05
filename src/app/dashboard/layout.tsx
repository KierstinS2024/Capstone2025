// src/app/dashboard/layout.tsx
"use client";

// --- React imports ---
import { ReactNode } from "react";

// --- Component imports ---
import ProtectedRoute from "@/components/ProtectedRoute"; // ensures user is authenticated
import NavBar from "@/components/NavBar"; // main dashboard navigation
import { ThemeProvider } from "@/context/ThemeContext"; // dark/light mode support

// --- Styles ---
import styles from "./DashboardLayout.module.css";

// --- Props ---
interface DashboardLayoutProps {
  children: ReactNode; // content of each dashboard page
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // Wrap the entire dashboard with theme support
    <ThemeProvider>
      {/* Protect all dashboard pages */}
      <ProtectedRoute>
        {/* Dashboard container */}
        <div className={styles.dashboardContainer}>
          {/* Always show NavBar on dashboard */}
          <NavBar />

          {/* Main page content */}
          <main className={styles.mainContent}>{children}</main>
        </div>
      </ProtectedRoute>
    </ThemeProvider>
  );
}
