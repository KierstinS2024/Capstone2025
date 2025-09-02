// src/app/dashboard/page.tsx
"use client";

/**
 * Wraps the DashboardPageContent with ProtectedRoute
 * Ensures only authenticated users can access the dashboard
 */

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardPageContent from "./DashboardPageContent";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
