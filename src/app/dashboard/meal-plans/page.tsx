// File: src/app/dashboard/meal-plans/page.tsx
"use client";

/**
 * MealPlansListPage
 *
 * Lists all meal plans for the logged-in user.
 * Allows navigation to view/edit each meal plan.
 * Provides a button to create a new meal plan.
 * Supports deleting a meal plan directly from the list.
 */

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// Import the reusable MealPlanCard component to display individual meal plans
import MealPlanCard from "@/components/MealPlanCard";

// Import the global context that stores the meal plans list
import { MealPlanContext } from "@/context/MealPlanContext";

// Import CSS module for page-specific styling
import styles from "./MealPlansListPage.module.css";

// Define TypeScript type for a meal plan (simplified for list view)
interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes: string;
}

export default function MealPlansListPage() {
  const router = useRouter();

  // Pull mealPlans state and setter from global context
  const { mealPlans, setMealPlans } = useContext(MealPlanContext);

  // Local UI state for loading spinner and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Grab JWT token from localStorage (only runs on client side)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /**
   * Redirect user to login if no token exists
   * We do this early to avoid fetching protected data unnecessarily
   */
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [router, token]);

  /**
   * Fetch all meal plans from backend API
   * Stores them in global context so other pages/components can access
   */
  useEffect(() => {
    if (!token) return;

    async function fetchMealPlans() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plans");

        // Save meal plans in global context
        setMealPlans(data.mealPlans || data || []);
      } catch (err: any) {
        setError(err.message || "Error loading meal plans");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, [token, setMealPlans]);

  /**
   * Delete a single meal plan by ID
   * Prompts the user for confirmation before deletion
   */
  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete meal plan");

      // Remove deleted meal plan from context state
      setMealPlans(mealPlans.filter((plan) => plan._id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting meal plan");
    }
  };

  // Show loading spinner if fetching data
  if (loading) return <p className={styles.message}>Loading meal plans...</p>;

  // Show error if fetch failed
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Meal Plans</h1>

      {/* Button to navigate to create new meal plan page */}
      <button
        className={styles.createButton}
        onClick={() => router.push("/dashboard/meal-plans/create")}
      >
        + Create New Meal Plan
      </button>

      {mealPlans.length === 0 ? (
        // Show message if user has no meal plans yet
        <p className={styles.emptyMessage}>
          You haven't created any meal plans yet.
        </p>
      ) : (
        // Grid display of meal plans
        <div className={styles.grid}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              mealPlan={plan}
              // Navigate to detail page when card is clicked
              onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              // Pass delete handler to card
              onDelete={() => handleDelete(plan._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
