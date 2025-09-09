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
