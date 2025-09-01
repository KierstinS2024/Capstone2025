/* src/app/dashboard/meal-plans/[id]/page.tsx */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";

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
  const { id } = useParams(); // get meal plan id from URL
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMealPlan() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setMealPlan(data);
        } else {
          setError(data.error || "Meal plan not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch meal plan");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [id]);

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Meal Plan for {mealPlan.weekStartDate}</h1>

      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

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
