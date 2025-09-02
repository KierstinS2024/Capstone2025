// path: src/app/dashboard/page.tsx

"use client";

/**
 * DashboardPage
 *
 * Displays the user's meal plans and welcome message.
 * - Fetches user info from /api/auth/me
 * - Fetches meal plans from /api/meal-plans
 * - Redirects to login if no valid token
 */

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./DashboardPage.module.css"; // dashboard-specific styles
import { AuthContext } from "@/context/AuthContext"; // ✅ for logout

interface User {
  id: string;
  email: string;
}

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useContext(AuthContext); // ✅ hook into logout
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token found, redirect to login
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
          router.push("/auth/login");
          return;
        }
        setUser(userData.user);

        // Fetch user's meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansData = await plansRes.json();
        setMealPlans(plansData.plans || []);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading)
    return <p className={styles.message}>Loading your dashboard...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.dashboardPage}>
      {/* Header row with welcome + logout */}
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
