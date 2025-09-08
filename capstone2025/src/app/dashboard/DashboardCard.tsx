// src/app/dashboard/DashboardCard.tsx
"use client";

/**
 * DashboardCard
 * Reusable card component for displaying sections on the dashboard.
 * Accepts a title and any children content.
 */

import { ReactNode } from "react";

interface DashboardCardProps {
  /** Title displayed at the top of the card */
  title: string;
  /** Content inside the card */
  children: ReactNode;
}

export default function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      {/* Card header */}
      <h2 className="dashboard-card-title">{title}</h2>

      {/* Card content */}
      <div className="dashboard-card-content">{children}</div>
    </div>
  );
}
