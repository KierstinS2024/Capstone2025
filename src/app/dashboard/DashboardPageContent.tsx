// Path: src/app/dashboard/DashboardPageContent.tsx
"use client";

/**
 * DashboardPageContent
 *
 * Displays user's dashboard with:
 * - Welcome header + logout
 * - Quick actions (create meal plan, generate shopping list)
 * - Today’s summary (nutrition placeholders)
 * - List of meal plans using MealPlanCard
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import MealPlanCard from "@/components/MealPlanCard";
import styles from "./DashboardPage.module.css";

interface User {
  _id: string;
  email: string;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: { _id: string }[];
}

export default function DashboardPageContent() {
  const router = useRouter();
  const { logout } = useAuth(); // ✅ Using the hook

  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    async function loadData() {
      try {
        // Fetch user info
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) return router.push("/auth/login");
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
      {/* Header */}
      <div className={styles.headerRow}>
        <h1 className={styles.welcome}>Welcome, {user?.email}</h1>
        <div className={styles.headerButtons}>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <button
          className={styles.actionButton}
          onClick={() => router.push("/dashboard/meal-plans/create")}
        >
          + Create New Meal Plan
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            if (!mealPlans[0])
              return alert("No meal plans available to generate list.");
            router.push(
              `/dashboard/shopping-lists/from-meal-plan/${mealPlans[0]._id}`
            );
          }}
        >
          Generate Shopping List
        </button>
      </section>

      {/* Today’s Summary (placeholder) */}
      <section className={styles.todaySummary}>
        <h2>Today’s Summary</h2>
        <div className={styles.summaryCards}>
          <div className={styles.card}>Calories: --</div>
          <div className={styles.card}>Protein: --</div>
          <div className={styles.card}>Carbs: --</div>
          <div className={styles.card}>
            Pending Groceries: {mealPlans.length}
          </div>
        </div>
      </section>

      {/* Meal Plans */}
      <section className={styles.section}>
        <h2>Your Meal Plans</h2>
        {mealPlans.length === 0 ? (
          <p className={styles.emptyMessage}>
            You haven't created any meal plans yet.
          </p>
        ) : (
          <div className={styles.cardsGrid}>
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan._id}
                id={plan._id}
                weekStartDate={plan.weekStartDate}
                notes={plan.notes}
                entriesCount={plan.entries?.length}
                onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
