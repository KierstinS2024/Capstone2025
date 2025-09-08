// src/app/dashboard/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  if (loading || !user) return <p>Loading dashboard...</p>;

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h1>Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
}
