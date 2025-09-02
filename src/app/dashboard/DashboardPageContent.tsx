// src/app/dashboard/DashboardPageContent.tsx

"use client";

/**
 * Handles fetching and displaying user info and meal plans.
 * - Fetches /api/auth/me for current user information
 * - Fetches /api/meal-plans for the logged-in user's meal plans
 * - Displays loading and error states
 * - Provides logout button
 */

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import styles from "./DashboardPage.module.css";

// Represents the currently logged-in user
interface User {
  id: string;
  email: string;
}

// Represents a single meal plan in the user's dashboard
interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function DashboardPageContent() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  // Local state
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user info and meal plans on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      router.push("/auth/login");
      return;
    }

    async function loadData() {
      try {
        // Fetch current user info
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (!userData.user) {
          // No user returned → redirect to login
          router.push("/auth/login");
          return;
        }

        setUser(userData.user);

        // Fetch user's meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansData = await plansRes.json();

        setMealPlans(plansData.mealPlans || []);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Display loading state
  if (loading)
    return <p className={styles.message}>Loading your dashboard...</p>;

  // Display error state
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.dashboardPage}>
      {/* Header row with welcome message and logout button */}
      <div className={styles.headerRow}>
        <h1 className={styles.welcome}>Welcome, {user?.email}</h1>
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Meal plans section */}
      <h2 className={styles.sectionTitle}>Your Meal Plans</h2>

      {mealPlans.length === 0 ? (
        <p className={styles.emptyMessage}>
          You haven't created any meal plans yet.
        </p>
      ) : (
        <ul className={styles.mealPlanList}>
          {mealPlans.map((plan) => (
            <li key={plan._id} className={styles.mealPlanItem}>
              <Link
                href={`/dashboard/meal-plans/${plan._id}`}
                className={styles.mealPlanLink}
              >
                Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                {plan.notes ? ` - ${plan.notes}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
