// src/app/dashboard/layout.tsx
"use client";

/**
 * DashboardLayout
 * Layout wrapper for all /dashboard pages.
 * Ensures user is authenticated before rendering children.
 * Provides a consistent header with logout functionality.
 */

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if not logged in once loading finishes
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  // Show loading placeholder while auth state resolves
  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      {/* Dashboard NavBar */}
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <h1>Dashboard</h1>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      {/* Main content */}
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
