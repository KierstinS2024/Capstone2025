// src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * MealPlanDetailPage
 *
 * Displays detailed information for a single meal plan:
 * - Week start date
 * - Notes (if any)
 * - List of meal entries
 * - Button to generate a shopping list
 *
 * Fetches data from /api/meal-plans/[id] and uses token from localStorage
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GenerateShoppingListButton from "@/components/GenerateShoppingListButton";
import styles from "./MealPlanDetailPage.module.css"; // create this CSS file

interface MealPlanEntry {
  recipeName: string;
  mealType: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: MealPlanEntry[];
}

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMealPlan() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Meal plan not found.");

        setMealPlan(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch meal plan."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [id]);

  const handleShoppingListGenerated = (shoppingListId: string) => {
    router.push(`/dashboard/shopping-lists/${shoppingListId}`);
  };

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Meal Plan for {mealPlan.weekStartDate}</h1>

      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

      <GenerateShoppingListButton
        mealPlanId={mealPlan._id}
        onSuccess={handleShoppingListGenerated}
      />

      {mealPlan.entries && mealPlan.entries.length > 0 ? (
        <div className={styles.entriesGrid}>
          {mealPlan.entries.map((entry, index) => (
            <div key={index} className={styles.entryCard}>
              <h3 className={styles.recipeName}>{entry.recipeName}</h3>
              <p className={styles.detail}>
                Meal: {entry.mealType} | Servings: {entry.servings}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.message}>No entries yet for this week.</p>
      )}

      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </main>
  );
}
