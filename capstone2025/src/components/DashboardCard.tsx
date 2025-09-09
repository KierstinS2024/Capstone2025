// Path: src/components/DashboardCard.tsx
// Purpose: Reusable card for displaying dashboard sections (title + content)
// Notes: Fully type-safe, uses ReactNode for children, CSS variables for styling

"use client";

import { ReactNode } from "react";

export interface DashboardCardProps {
  /** Title displayed at the top of the card */
  title: string;
  /** Content inside the card */
  children: ReactNode;
}

export default function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="dashboard-card card">
      <h2 className="dashboard-card-title">{title}</h2>
      <div className="dashboard-card-content">{children}</div>
      <style jsx>{`
        .dashboard-card-title {
          font-size: var(--font-lg);
          margin-bottom: var(--space-sm);
        }
        .dashboard-card-content {
          font-size: var(--font-md);
        }
      `}</style>
    </div>
  );
}
