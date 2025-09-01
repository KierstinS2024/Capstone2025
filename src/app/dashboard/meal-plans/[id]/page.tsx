// path: src/app/dashboard/meal-plans/[id]/page.tsx
/**
 * MealPlanDetailPage
 *
 * Displays a single meal plan with its entries, notes, and allows
 * the user to generate a shopping list for that plan.
 *
 * Features:
 * - Fetches meal plan by ID
 * - Displays entries and notes
 * - Integrates GenerateShoppingListButton
 * - Handles loading, error, and empty states
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";
import GenerateShoppingListButton from "@/components/GenerateShoppingListButton";

// Interface for a single entry in the meal plan
interface MealPlanEntry {
  recipeName: string;
  mealType: string;
  servings: number;
}

// Interface for the meal plan data
interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: MealPlanEntry[];
}

export default function MealPlanDetailPage() {
  const { id } = useParams(); // Get meal plan ID from URL
  const router = useRouter();

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch meal plan from API when component mounts or ID changes
  useEffect(() => {
    async function fetchMealPlan() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this meal plan.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setMealPlan(data);
        } else {
          setError(data.message || "Meal plan not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch meal plan.");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [id]);

  // Callback after generating a shopping list to optionally navigate or refresh
  const handleShoppingListCreated = (listId: string) => {
    // Navigate to the shopping list page after creation
    router.push(`/dashboard/shopping-lists/${listId}`);
  };

  // Render loading, error, or meal plan content
  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Meal Plan for {mealPlan.weekStartDate}</h1>

      {/* Display optional notes */}
      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

      {/* Button to generate shopping list for this meal plan */}
      <GenerateShoppingListButton
        mealPlanId={mealPlan._id}
        onSuccess={handleShoppingListCreated}
      />

      {/* Display meal plan entries */}
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

      {/* Back button to navigate to previous page */}
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </main>
  );
}
