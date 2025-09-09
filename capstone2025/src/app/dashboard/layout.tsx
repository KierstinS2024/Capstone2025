"use client";
import { ReactNode } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar / Hamburger for mobile */}
      <HamburgerMenu>
        <nav className="dashboard-nav">
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/recipes">Recipes</a>
          <a href="/dashboard/meal-plans">Meal Plans</a>
          <a href="/dashboard/shopping-lists">Shopping Lists</a>
          <a href="/dashboard/food-intake">Food Intake</a>
        </nav>
      </HamburgerMenu>

      {/* Main content */}
      <main className="dashboard-main">{children}</main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          gap: 1rem;
        }
        .dashboard-main {
          flex: 1;
          padding: var(--space-lg);
        }
        .dashboard-nav a {
          display: block;
          padding: var(--space-sm) var(--space-md);
          margin-bottom: var(--space-sm);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          transition: background-color 0.2s;
        }
        .dashboard-nav a:hover {
          background-color: var(--bg-hover);
        }
      `}</style>
    </div>
  );
}
