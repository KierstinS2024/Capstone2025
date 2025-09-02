// path: src/app/dashboard/page.tsx

"use client";

/**
 * DashboardPage
 *
 * Displays the user's meal plans and welcome message.
 * - Uses AuthContext for logged-in user + token
 * - Fetches meal plans from /api/meal-plans
 * - Redirects handled by ProtectedRoute
 */

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./DashboardPage.module.css"; // dashboard-specific styles

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function DashboardPage() {
  const { user, token, logout } = useContext(AuthContext);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMealPlans() {
      try {
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load meal plans");
        const data = await res.json();
        setMealPlans(data.plans || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your meal plans.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadMealPlans();
    }
  }, [token]);

  return (
    <ProtectedRoute>
      <div className={styles.dashboardPage}>
        {/* Welcome header */}
        <div className={styles.headerRow}>
          <h1 className={styles.welcome}>Welcome, {user?.email}</h1>
          <button onClick={logout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>

        {/* Meal plans section */}
        <h2 className={styles.sectionTitle}>Your Meal Plans</h2>

        {loading ? (
          <p className={styles.message}>Loading your meal plans...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : mealPlans.length === 0 ? (
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
    </ProtectedRoute>
  );
}
