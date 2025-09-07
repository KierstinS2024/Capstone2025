// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useMealPlanContext } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { MealPlan } from "@/types/mealPlan";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal plans");

        const data = await res.json();
        // --- assume API populates entries.recipeId with Recipe objects ---
        setMealPlans(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, setMealPlans]);

  if (loading) return <p className={styles.message}>Loading dashboard...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome, {user?.email}</h1>

      {/* Static navigation cards */}
      <section className={styles.cards}>
        <Link href="/dashboard/ingredients" className={styles.card}>
          <h2>🧂 Ingredients</h2>
          <p>Manage your ingredients</p>
        </Link>
        <Link href="/dashboard/recipes" className={styles.card}>
          <h2>🍲 Recipes</h2>
          <p>Create, edit, and view recipes</p>
        </Link>
        <Link href="/dashboard/meal-plans" className={styles.card}>
          <h2>📅 Meal Plans</h2>
          <p>Plan your weekly meals</p>
        </Link>
      </section>

      {/* Quick actions */}
      <section className={styles.quickActions}>
        <button
          className={styles.actionButton}
          onClick={() => router.push("/dashboard/meal-plans/new")}
        >
          + Create New Meal Plan
        </button>
      </section>

      {/* User Meal Plans */}
      <section className={styles.section}>
        <h2>Your Meal Plans</h2>
        {mealPlans.length === 0 ? (
          <p className={styles.emptyMessage}>
            You haven’t created any meal plans yet.
          </p>
        ) : (
          <div className={styles.cardsGrid}>
            {mealPlans.map((plan: MealPlan) => (
              <MealPlanCard
                key={plan._id}
                id={plan._id}
                weekStartDate={plan.weekStartDate}
                notes={plan.notes}
                entriesCount={plan.entries?.length}
                onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              >
                {/* Display recipe titles for each entry */}
                <ul>
                  {plan.entries.map((entry) => (
                    <li key={entry._id}>
                      {entry.recipeId?.title || "Unknown Recipe"} -{" "}
                      {entry.servings} servings
                    </li>
                  ))}
                </ul>
              </MealPlanCard>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
