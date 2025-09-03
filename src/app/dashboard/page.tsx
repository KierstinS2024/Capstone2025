// src/app/dashboard/page.tsx
"use client";

/**
 * DashboardPage.tsx
 * -------------------
 * Main landing page after login.
 * Displays welcome message, logout button, and navigation to app sections.
 */

import styles from "./page.module.css";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {/* Header with user greeting */}
        <header className={styles.header}>
          <h1 className={styles.welcomeMessage}>
            Welcome, {user?.email ?? "User"}
          </h1>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </header>

        {/* Navigation menu */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/dashboard/recipes">Recipes</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/ingredients">Ingredients</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/meal-plans">Meal Plans</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/food-intake">Food Intake</a>
            </li>
            <li className={styles.navItem}>
              <a href="/dashboard/shopping-lists">Shopping Lists</a>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className={styles.main}>
          <p>Select a section from the navigation to get started.</p>
        </main>
      </div>
    </ProtectedRoute>
  );
}
