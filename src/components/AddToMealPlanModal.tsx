// PATH: src/components/AddToMealPlanModal.tsx
"use client";

import React, { useState } from "react";
import { MealPlan, MealType } from "@/lib/mealPlanApi";
import { useMealPlans } from "@/context/MealPlanContext";
import { Recipe } from "@/context/RecipeContext";

interface Props {
  recipe: Recipe;
  plan: MealPlan;
  mealType: MealType;
  onClose: () => void;
}

export default function AddToMealPlanModal({
  recipe,
  plan,
  mealType,
  onClose,
}: Props) {
  const { updateMeal } = useMealPlans();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!recipe.id || !plan.id) return; // safety check
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      await updateMeal(plan.id, today, mealType, recipe.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>
        Add <strong>{recipe.title}</strong> to <strong>{plan.title}</strong> (
        {mealType})
      </h3>
      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add to Meal Plan"}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
