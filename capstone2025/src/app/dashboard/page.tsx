// path: src/app/dashboard/page.tsx
"use client";

/**
 * DashboardPage
 * -------------
 * Displays user-specific dashboard data including next meal, shopping list count,
 * recent intake, and favorites count. Protected route — only accessible to authenticated users.
 * Fetches data from /api/dashboard using the HttpOnly cookie-based auth.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardCard from "../../components/DashboardCard";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DashboardData {
  nextMeal: string | null;
  shoppingListCount: number;
  recentIntake: string | null;
  favoritesCount: number;
}

export default function DashboardPage() {
  // Wrap dashboard in ProtectedRoute to enforce auth
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    /**
     * fetchDashboard
     * --------------
     * Fetches dashboard data from the server.
     * Relies on HttpOnly cookie for authentication.
     */
    const fetchDashboard = async () => {
      setFetching(true);
      setError(null);

      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", // sends HttpOnly cookie automatically
        });

        const data: DashboardData & { message?: string } = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to load dashboard");

        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching dashboard");
      } finally {
        setFetching(false);
      }
    };

    if (!loading && user) fetchDashboard();
  }, [loading, user]);

  // Render loading state
  if (loading || fetching) return <p>Loading dashboard...</p>;

  // Render error state
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Render empty state
  if (!dashboardData) return <p>No dashboard data available.</p>;

  // Render dashboard cards
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <DashboardCard title="Next Meal">
        {dashboardData.nextMeal || "N/A"}
      </DashboardCard>
      <DashboardCard title="Shopping List Items">
        {dashboardData.shoppingListCount}
      </DashboardCard>
      <DashboardCard title="Recent Food Intake">
        {dashboardData.recentIntake || "N/A"}
      </DashboardCard>
      <DashboardCard title="Favorites">
        {dashboardData.favoritesCount}
      </DashboardCard>
    </div>
  );
}
