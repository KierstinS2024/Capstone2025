// src/components/DashboardCard.tsx
import React from "react";

interface DashboardCardProps {
  title: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div>
      {/* Card title */}
      <h2>{title}</h2>
      {/* Card content */}
      {children}
    </div>
  );
};

export default DashboardCard;
