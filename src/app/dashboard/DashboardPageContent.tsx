// src/app/dashboard/DashboardPageContent.tsx
"use client";

/**
 * DashboardPageContent
 *
 * Displays user's meal plans and provides navigation to shopping lists.
 */

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import styles from "./DashboardPage.module.css";

interface User {
  id: string;
  email: string;
}

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function DashboardPageContent() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function loadData() {
      try {
        // Fetch user info
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) {
          router.push("/auth/login");
          return;
        }
        setUser(userData.user);

        // Fetch meal plans
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

  if (loading)
    return <p className={styles.message}>Loading your dashboard...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.dashboardPage}>
      {/* Header with welcome + logout */}
      <div className={styles.headerRow}>
        <h1 className={styles.welcome}>Welcome, {user?.email}</h1>
        <div>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
          {/* New Shopping Lists button */}
          <Link
            href="/dashboard/shopping-lists"
            className={styles.shoppingListsButton}
          >
            Your Shopping Lists
          </Link>
        </div>
      </div>

      {/* Meal plans list */}
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
