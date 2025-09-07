"use client";

/**
 * MealPlanPage
 * -------------------------
 * Individual Meal Plan view page
 * Features:
 * - ProtectedRoute wrapper
 * - Displays meal plan title, week start, notes, and all entries
 * - Handles `recipeId` being either string or populated Recipe object
 * - Edit and delete actions
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import styles from "./MealPlanPage.module.css";

export default function MealPlanPage() {
  return (
    <ProtectedRoute>
      <MealPlanContent />
    </ProtectedRoute>
  );
}

function MealPlanContent() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const planId = params.id;

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Fetch meal plan by ID
  // -----------------------------
  useEffect(() => {
    async function fetchMealPlan() {
      if (!user || !planId) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal plan");

        const data = await res.json();
        setMealPlan(data.data || null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [user, planId]);

  // -----------------------------
  // Delete meal plan handler
  // -----------------------------
  const handleDelete = async () => {
    if (!mealPlan) return;
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${mealPlan._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete meal plan");
      router.push("/dashboard/meal-plans");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  // -----------------------------
  // Loading / Error states
  // -----------------------------
  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found.</p>;

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{mealPlan.title}</h1>

      {mealPlan.weekStartDate && (
        <p>
          Week starting: {new Date(mealPlan.weekStartDate).toLocaleDateString()}
        </p>
      )}

      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

      <section className={styles.section}>
        <h2>Entries</h2>
        {mealPlan.entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          <ul>
            {mealPlan.entries.map((entry: MealPlanEntry) => {
              // Handle recipeId as string or populated Recipe object
              const recipe =
                typeof entry.recipeId === "string" ? null : entry.recipeId;
              const recipeTitle = recipe?.title || "Recipe not loaded";

              return (
                <li key={entry._id}>
                  {recipeTitle} - {entry.servings} servings
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button
        className={styles.editButton}
        onClick={() =>
          router.push(`/dashboard/meal-plans/${mealPlan._id}/edit`)
        }
      >
        Edit
      </button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete
      </button>
      <button
        className={styles.backButton}
        onClick={() => router.push("/dashboard/meal-plans")}
      >
        ← Back to Meal Plans
      </button>
    </main>
  );
}
