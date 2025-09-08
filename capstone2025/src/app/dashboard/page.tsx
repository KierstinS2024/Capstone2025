// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import QuickLinks from "./QuickLinks";

// --------------------
// Type definition for dashboard data returned from API
// --------------------
interface DashboardData {
  nextMeal: string | null;
  shoppingListCount: number;
  recentIntake: string | null;
  favoritesCount: number;
}

/**
 * DashboardPage
 * Main landing page after login.
 * Fetches and displays summary of user's meals, shopping lists, food intake, and favorites.
 */
export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    const fetchDashboard = async () => {
      setFetching(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
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

    fetchDashboard();
  }, [user, loading, router]);

  if (loading || fetching) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!dashboardData) return <p>No dashboard data available.</p>;

  return (
    <div className="dashboard-page">
      <header>
        <h1>Welcome, {user?.email}</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {/* Quick action buttons */}
      <QuickLinks />

      {/* Dashboard overview cards */}
      <section className="dashboard-overview" style={{ marginTop: "2rem" }}>
        <h2>Dashboard Overview</h2>
        <div
          className="dashboard-cards"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
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
      </section>
    </div>
  );
}
