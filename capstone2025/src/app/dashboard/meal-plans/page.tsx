// src/app/dashboard/meal-plans/page.tsx
"use client";

/**
 * Dashboard Meal Plans Page
 * -------------------------
 * Lists all meal plans for the logged-in user.
 * Features:
 * - ProtectedRoute
 * - Fetch user-specific meal plans from `/api/meal-plans`
 * - "Create New Meal Plan" button
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { MealPlan } from "@/types/mealPlan";
import styles from "./MealPlansPage.module.css";

export default function MealPlansPage() {
  return (
    <ProtectedRoute>
      <MealPlansContent />
    </ProtectedRoute>
  );
}

function MealPlansContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMealPlans() {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal plans");

        const data = await res.json();
        setMealPlans(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, [user]);

  if (loading) return <p className={styles.message}>Loading meal plans...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Meal Plans</h1>

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/meal-plans/new")}
      >
        + Create New Meal Plan
      </button>

      {mealPlans.length === 0 ? (
        <p className={styles.emptyMessage}>No meal plans created yet.</p>
      ) : (
        <div className={styles.cardsGrid}>
          {mealPlans.map((plan) => (
            <div
              key={plan._id}
              className={styles.card}
              onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
            >
              <h2>{plan.title}</h2>
              <p>{plan.entries.length} entries</p>
              {plan.weekStartDate && (
                <small>
                  Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
