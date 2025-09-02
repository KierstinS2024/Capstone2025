// path: src/app/dashboard/layout.tsx
"use client";

import { ReactNode, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Meal Planner Dashboard</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>
              Home
            </Link>
            <Link href="/dashboard/recipes" className={styles.navLink}>
              Recipes
            </Link>
            <Link href="/dashboard/shopping-lists" className={styles.navLink}>
              Shopping Lists
            </Link>
            <span onClick={logout} className={styles.logout}>
              Logout
            </span>
          </nav>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
