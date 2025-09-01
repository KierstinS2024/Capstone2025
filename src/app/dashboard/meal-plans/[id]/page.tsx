// path: src/app/dashboard/meal-plans/[id]/page.tsx
/**
 * MealPlanDetailPage
 *
 * Displays the details of a single meal plan including:
 * - Week start date
 * - Notes
 * - Entries (recipes, meal types, servings)
 * - Button to generate shopping list
 * - Displays generated shopping lists dynamically
 *
 * Features:
 * - Fetches meal plan from API using JWT from localStorage
 * - Handles loading and error states
 * - Back navigation button
 * - Clean, intuitive UI structure with CSS modules
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";
import GenerateShoppingListButton from "@/components/GenerateShoppingListButton";
import ShoppingListCard from "@/components/ShoppingListCard";

// TypeScript interfaces for clarity
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

interface ShoppingListItem {
  ingredientName: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface ShoppingList {
  _id: string;
  createdAt: string;
  items: ShoppingListItem[];
}

export default function MealPlanDetailPage() {
  const { id } = useParams(); // meal plan ID from URL
  const router = useRouter();

  // State for meal plan
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for generated shopping lists
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Fetch meal plan details from API
  useEffect(() => {
    async function fetchMealPlan() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this meal plan.");
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

  // Fetch user's shopping lists to display
  const fetchShoppingLists = async () => {
    setLoadingLists(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/shopping-lists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setShoppingLists(data.lists || []);
      }
    } catch (err) {
      console.error("Error fetching shopping lists:", err);
    } finally {
      setLoadingLists(false);
    }
  };

  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <main className={styles.container}>
      {/* Header */}
      <h1 className={styles.title}>
        Meal Plan for {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h1>

      {/* Optional notes */}
      {mealPlan.notes && (
        <p className={styles.notes}>Notes: {mealPlan.notes}</p>
      )}

      {/* Meal plan entries */}
      {mealPlan.entries && mealPlan.entries.length > 0 ? (
        <div className={styles.entriesGrid}>
          {mealPlan.entries.map((entry, idx) => (
            <div key={idx} className={styles.entryCard}>
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

      {/* Button to generate shopping list */}
      <div className="mt-6">
        <GenerateShoppingListButton
          mealPlanId={mealPlan._id}
          onSuccess={fetchShoppingLists} // Refresh shopping lists after generation
        />
      </div>

      {/* Display user's shopping lists */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Shopping Lists</h2>
        {loadingLists ? (
          <p>Loading shopping lists...</p>
        ) : shoppingLists.length === 0 ? (
          <p>No shopping lists generated yet.</p>
        ) : (
          <div className={styles.entriesGrid}>
            {shoppingLists.map((list) => (
              <ShoppingListCard key={list._id} shoppingList={list} />
            ))}
          </div>
        )}
      </section>

      {/* Back button */}
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
    </main>
  );
}
