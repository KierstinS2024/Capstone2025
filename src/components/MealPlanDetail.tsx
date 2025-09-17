// PATH: src/components/MealPlanDetail.tsx
"use client";

import React, { useState } from "react";
import { MealPlan } from "../lib/mealPlanApi";
import { useRecipes } from "../context/RecipeContext";
import RecipeModal from "./RecipeModal";
import styles from "../styles/mealplan-detail.module.css";
import { formatDateRange, getWeekDates } from "../lib/helpers";

interface Props {
  plan: MealPlan;
  onSave: (updated: MealPlan) => void;
}

export default function MealPlanDetail({ plan, onSave }: Props) {
  const { recipes } = useRecipes();
  const [editingPlan, setEditingPlan] = useState<MealPlan>(
    structuredClone(plan)
  );
  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);

  const weekDays = getWeekDates(plan.startDate);

  function updateMeal(
    day: string,
    meal: "breakfast" | "lunch" | "dinner",
    recipeId: string
  ) {
    const copy = structuredClone(editingPlan);
    if (!copy.meals[day]) copy.meals[day] = {};
    copy.meals[day][meal] = recipeId;
    setEditingPlan(copy);
  }

  function handleSave() {
    onSave(editingPlan);
  }

  return (
    <div className={styles.detail}>
      <h2>Meal Plan: {formatDateRange(plan.startDate, plan.endDate)}</h2>

      <table className={styles.planTable}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((day) => {
            const dayMeals = editingPlan.meals[day] || {};
            return (
              <tr key={day}>
                <td>{day}</td>
                {["breakfast", "lunch", "dinner"].map((meal) => {
                  const recipeId = dayMeals[meal];
                  const recipe = recipes.find((r) => r._id === recipeId);
                  return (
                    <td key={meal}>
                      {recipe ? (
                        <button onClick={() => setViewingRecipeId(recipe._id)}>
                          {recipe.title}
                        </button>
                      ) : (
                        <span className={styles.empty}>—</span>
                      )}
                      <select
                        onChange={(e) =>
                          updateMeal(day, meal as any, e.target.value)
                        }
                        value={recipeId || ""}
                      >
                        <option value="">— Select —</option>
                        {recipes.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Meal Plan
      </button>

      {viewingRecipeId && (
        <RecipeModal
          recipeId={viewingRecipeId}
          onClose={() => setViewingRecipeId(null)}
        />
      )}
    </div>
  );
}
