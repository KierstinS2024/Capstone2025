// src/app/dashboard/meal-plans/page.tsx
"use client";

/**
 * MealPlansListPage
 *
 * Lists all meal plans for the logged-in user
 * Allows navigation to view/edit each meal plan
 * Provides a button to create a new meal plan
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MealPlansListPage.module.css";

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes: string;
}

export default function MealPlansListPage() {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchMealPlans() {
      if (!token) return router.push("/auth/login");
      try {
        setLoading(true);
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plans");
        setMealPlans(data.mealPlans || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading meal plans"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMealPlans();
  }, [router, token]);

  if (loading) return <p className={styles.message}>Loading meal plans...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Meal Plans</h1>

      <button
        className={styles.createButton}
        onClick={() => router.push("/dashboard/meal-plans/create")}
      >
        + Create New Meal Plan
      </button>

      {mealPlans.length === 0 ? (
        <p className={styles.emptyMessage}>
          You haven't created any meal plans yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {mealPlans.map((plan) => (
            <li
              key={plan._id}
              className={styles.listItem}
              onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
            >
              <strong>
                Week of {new Date(plan.weekStartDate).toLocaleDateString()}
              </strong>
              <p>{plan.notes || "No notes"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
