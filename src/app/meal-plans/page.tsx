// path: src/app/meal-plans/page.tsx
"use client";

import React from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import "@/styles/mealPlans.css";

export default function MealPlansPage() {
  const { mealPlans, loading } = useMealPlans();

  if (loading) return <p className="loading">Loading meal plans...</p>;

  return (
    <div className="meal-plans-page">
      <h1 className="page-title">Meal Plans</h1>

      {mealPlans.length === 0 ? (
        <p className="empty-state">
          No meal plans yet. Add one to get started!
        </p>
      ) : (
        <ul className="meal-plan-list">
          {mealPlans.map((plan) => (
            <li key={plan._id} className="meal-plan-card">
              <h2 className="meal-plan-date">{plan.date}</h2>
              {plan.meals.length === 0 ? (
                <p className="no-meals">No meals yet in this plan.</p>
              ) : (
                <ul className="meals-list">
                  {plan.meals.map((meal) => (
                    <li key={meal.id} className="meal-item">
                      <strong>{meal.name}</strong>
                      {meal.description && `: ${meal.description}`}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
