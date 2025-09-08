// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardCard from "./DashboardCard";

interface DashboardData {
  nextMeal: string | null;
  shoppingListCount: number;
  recentIntake: string | null;
  favoritesCount: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
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

    if (!loading && user) fetchDashboard();
  }, [loading, user]);

  if (loading || fetching) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!dashboardData) return <p>No dashboard data available.</p>;

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
