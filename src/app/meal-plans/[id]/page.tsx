// src/app/meal-plans/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMealPlan } from "@/context/MealPlanContext";
import { AddMealForm } from "@/components/AddMealForrm";
import { Meal } from "@/types/mealPlan";

/**
 * Meal Plan Detail Page
 * Displays meals in a single plan and allows adding/removing meals.
 */
export default function MealPlanDetailPage() {
  // Get the meal plan ID from the URL
  const { id: mealPlanId } = useParams();

  // Destructure context functions and state
  const { mealPlans, fetchMealPlans, addMeal, removeMeal } = useMealPlan();

  // Local state for the current meal plan
  const [mealPlan, setMealPlan] = useState(
    mealPlans.find((mp) => mp._id === mealPlanId)
  );

  // Loading state while fetching data
  const [loading, setLoading] = useState(!mealPlan);

  // Fetch the meal plan if it is not yet in context
  useEffect(() => {
    if (!mealPlan) {
      setLoading(true);
      fetchMealPlans().finally(() => {
        // Update local state with fetched meal plan
        setMealPlan(mealPlans.find((mp) => mp._id === mealPlanId));
        setLoading(false);
      });
    }
  }, [mealPlan, mealPlanId, fetchMealPlans, mealPlans]);

  // Handler to add a new meal to this meal plan
  const handleAddMeal = (meal: Meal) => {
    addMeal(mealPlanId!, meal); // update context
    // Optimistically update local state to show immediately
    setMealPlan((prev) =>
      prev ? { ...prev, meals: [...prev.meals, meal] } : prev
    );
  };

  // Handler to remove a meal from this meal plan
  const handleRemoveMeal = (mealId: string) => {
    removeMeal(mealPlanId!, mealId); // update context
    // Update local state to reflect removal
    setMealPlan((prev) =>
      prev
        ? { ...prev, meals: prev.meals.filter((m) => m.id !== mealId) }
        : prev
    );
  };

  // Show loading state while fetching
  if (loading) return <p>Loading meal plan...</p>;

  // Show message if meal plan not found
  if (!mealPlan) return <p>Meal plan not found.</p>;

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      {/* Meal plan title */}
      <h1 style={{ marginBottom: "16px" }}>{mealPlan.name}</h1>

      {/* Add Meal Form */}
      <AddMealForm onAdd={handleAddMeal} />

      {/* List of meals in the plan */}
      {mealPlan.meals.length === 0 ? (
        <p>No meals yet in this plan.</p>
      ) : (
        <ul>
          {mealPlan.meals.map((meal) => (
            <li key={meal.id} style={{ marginBottom: "8px" }}>
              <strong>{meal.name}</strong>: {meal.description}
              {/* Remove meal button */}
              <button
                onClick={() => handleRemoveMeal(meal.id)}
                style={{ marginLeft: "12px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
