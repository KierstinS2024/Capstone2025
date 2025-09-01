// path: src/app/dashboard/meal-plans/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";
import GenerateShoppingListButton from "@/components/GenerateShoppingListButton";

/**
 * Represents a single meal plan entry
 */
interface MealPlanEntry {
  recipeName: string;
  mealType: string;
  servings: number;
}

/**
 * Represents the full meal plan object returned from the backend
 */
interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: MealPlanEntry[];
}

/**
 * MealPlanDetailPage
 *
 * Displays the details for a single meal plan including:
 * - Week start date
 * - Notes (if any)
 * - Meal entries with recipe, meal type, and servings
 * - Button to generate shopping list from this meal plan
 */
export default function MealPlanDetailPage() {
  const { id } = useParams(); // Extract meal plan ID from URL
  const router = useRouter();

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch meal plan details from the backend API
   */
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

        if (!res.ok) {
          throw new Error(data.message || "Meal plan not found.");
        }

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

  /**
   * Callback when a shopping list is successfully generated
   * @param shoppingListId - The newly created shopping list ID
   */
  const handleShoppingListGenerated = (shoppingListId: string) => {
    // Redirect user to the generated shopping list page
    router.push(`/dashboard/shopping-lists/${shoppingListId}`);
  };

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <main className={styles.container}>
      {/* Page title showing the week start date */}
      <h1 className={styles.title}>Meal Plan for {mealPlan.weekStartDate}</h1>

      {/* Display optional notes */}
      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

      {/* Generate Shopping List Button */}
      <GenerateShoppingListButton
        mealPlanId={mealPlan._id}
        onSuccess={handleShoppingListGenerated}
      />

      {/* Display meal entries */}
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

      {/* Back button */}
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </main>
  );
}
