// Path: src/app/dashboard/page.tsx
"use client";

/**
 * DashboardPage
 * -------------
 * Main authenticated dashboard.
 * Shows summary cards and quick links.
 */

import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  nextMeal: string | null;
  shoppingListCount: number;
  recentIntake: string | null;
  favoritesCount: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || loading) return;

    const fetchData = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard", { credentials: "include" });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json.message || "Failed to fetch dashboard");
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [user, loading]);

  if (loading || fetching) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "var(--danger)" }}>Error: {error}</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <DashboardLayout>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr",
        }}
      >
        {/* Cards */}
        <DashboardCard title="Next Meal">
          {data.nextMeal || "N/A"}
        </DashboardCard>
        <DashboardCard title="Shopping List Items">
          {data.shoppingListCount}
        </DashboardCard>
        <DashboardCard title="Recent Food Intake">
          {data.recentIntake || "N/A"}
        </DashboardCard>
        <DashboardCard title="Favorites">{data.favoritesCount}</DashboardCard>

        <style jsx>{`
          @media (min-width: 768px) {
            div {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            div {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}
