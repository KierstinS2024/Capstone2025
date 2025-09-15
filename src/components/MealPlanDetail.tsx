// path: src/components/MealPlanDetail.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MealPlan, Meal } from "@/types/mealPlan";

interface MealPlanDetailProps {
  plan: MealPlan; // Full meal plan object
  onRemoveMeal?: (mealId: string) => void; // Optional callback for removing a meal
}

/**
 * MealPlanDetail component
 * ------------------------
 * Displays all meals in a meal plan across its date range.
 * Used in: /meal-plans/[id] page
 */
export default function MealPlanDetail({
  plan,
  onRemoveMeal,
}: MealPlanDetailProps) {
  if (!plan) {
    return <p className="empty">Meal plan not found.</p>;
  }

  return (
    <div className="mealplan-detail">
      {/* Header */}
      <div className="header">
        <h2>
          Meal Plan: {plan.startDate} → {plan.endDate}
        </h2>
        <Link href="/meal-plans" className="back-link">
          ← Back to Plans
        </Link>
      </div>

      {/* Meals grouped by date */}
      <div className="meals-by-day">
        {plan.meals.length === 0 ? (
          <p className="empty">No meals added yet.</p>
        ) : (
          plan.meals.map((meal: Meal) => (
            <div key={meal.id} className="meal-entry">
              {/* Image preview */}
              {meal.image && (
                <img src={meal.image} alt={meal.name} className="meal-image" />
              )}

              {/* Info */}
              <div className="meal-info">
                <h4>{meal.name}</h4>
                <p>
                  {meal.type} • {meal.date}
                </p>
              </div>

              {/* Actions */}
              <div className="meal-actions">
                <Link href={`/recipes/${meal.recipeId}`} className="view-link">
                  View Recipe
                </Link>
                {onRemoveMeal && (
                  <button
                    className="remove-button"
                    onClick={() => onRemoveMeal(meal.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
