// path: src/app/meal-plans/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useMealPlans } from "@/context/MealPlanContext";
import { AddMealForm } from "@/components/AddMealForm";
import { Meal } from "@/types/mealPlan";
import "@/styles/mealplan-detail.css";

export default function MealPlanDetailPage() {
  const { id: mealPlanId } = useParams();
  const { mealPlans, fetchMealPlans, addMeal, removeMeal } = useMealPlans();

  const [mealPlan, setMealPlan] = useState(
    mealPlans.find((mp) => mp._id === mealPlanId)
  );
  const [loading, setLoading] = useState(!mealPlan);

  useEffect(() => {
    if (!mealPlan) {
      setLoading(true);
      fetchMealPlans().finally(() => {
        setMealPlan(mealPlans.find((mp) => mp._id === mealPlanId));
        setLoading(false);
      });
    }
  }, [mealPlan, mealPlanId, fetchMealPlans, mealPlans]);

  const handleAddMeal = (meal: Meal) => {
    addMeal(mealPlanId!, meal);
    setMealPlan((prev) =>
      prev ? { ...prev, meals: [...prev.meals, meal] } : prev
    );
  };

  const handleRemoveMeal = (mealId: string) => {
    removeMeal(mealPlanId!, mealId);
    setMealPlan((prev) =>
      prev
        ? { ...prev, meals: prev.meals.filter((m) => m.id !== mealId) }
        : prev
    );
  };

  if (loading) return <p className="loading">Loading meal plan...</p>;
  if (!mealPlan) return <p className="empty-state">Meal plan not found.</p>;

  return (
    <div className="mealplan-detail-page">
      <h1 className="page-title">{mealPlan.date}</h1>

      <AddMealForm onAdd={handleAddMeal} />

      {mealPlan.meals.length === 0 ? (
        <p className="no-meals">No meals yet in this plan.</p>
      ) : (
        <ul className="meals-list">
          {mealPlan.meals.map((meal) => (
            <li key={meal.id} className="meal-item">
              <strong>{meal.name}</strong>
              {meal.description && `: ${meal.description}`}
              <button
                className="remove-button"
                onClick={() => handleRemoveMeal(meal.id)}
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
