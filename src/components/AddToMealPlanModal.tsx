// ===========================================
// PATH: src/components/AddToMealPlanModal.tsx
// Unified Add-to-MealPlan modal
// ===========================================
"use client";

import React, { useState } from "react";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";
import { parseInstructions } from "@/utils/parseInstructions";

interface Props {
  recipe?: Recipe;
  plan: MealPlan;
  onClose: () => void;
  onAdd?: (mealType: MealType, recipe: Recipe) => void;
}

export default function AddToMealPlanModal({
  recipe,
  plan,
  onClose,
  onAdd,
}: Props) {
  const { updateMeal } = useMealPlans();
  const { addRecipe } = useRecipes();
  const [mealType, setMealType] = useState<MealType>("dinner");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Add recipe to meal plan
  // -----------------------------
  const handleAdd = async () => {
    if (!plan.id || !recipe) return;

    setLoading(true);
    try {
      let recipeToAdd: Recipe;

      // If Spoonacular recipe → persist as temp user recipe
      if (recipe.source === "spoonacular" && !recipe.id?.startsWith("db_")) {
        recipeToAdd = await addRecipe(
          {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            image: recipe.image,
            source: "spoonacular",
            temporary: true,
            linkedMealPlanIds: [plan.id],
          },
          true // temporary flag
        );
      } else {
        recipeToAdd = recipe;

        // Ensure plan linkage
        if (plan.id && !recipeToAdd.linkedMealPlanIds?.includes(plan.id)) {
          recipeToAdd.linkedMealPlanIds = [
            ...(recipeToAdd.linkedMealPlanIds || []),
            plan.id,
          ];
        }
      }

      const today = new Date().toISOString().split("T")[0];
      await updateMeal(plan.id, today, mealType, recipeToAdd.id);

      if (onAdd) onAdd(mealType, recipeToAdd);
      onClose();
    } catch (err) {
      console.error("Failed to add recipe to meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="modal">
      <h3>
        Add {recipe ? <strong>{recipe.title}</strong> : "a recipe"} to{" "}
        <strong>{plan.title || `${plan.startDate} → ${plan.endDate}`}</strong>
      </h3>

      {/* Meal type selector */}
      <label style={{ display: "block", margin: "1rem 0" }}>
        Meal type:{" "}
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </label>

      {/* Recipe preview */}
      {recipe ? (
        <div style={{ margin: "1rem 0", whiteSpace: "pre-wrap" }}>
          {parseInstructions(recipe.instructions)}
        </div>
      ) : (
        <p>Please select a recipe to add.</p>
      )}

      {/* Actions */}
      <div style={{ marginTop: "1rem" }}>
        {recipe && (
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add to Meal Plan"}
          </button>
        )}
        <button onClick={onClose} style={{ marginLeft: "0.5rem" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
