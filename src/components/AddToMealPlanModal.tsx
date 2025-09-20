// ===========================================
// PATH: src/components/AddToMealPlanModal.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { MealPlan, MealType } from "@/lib/mealPlanApi";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";
import { parseInstructions } from "@/utils/parseInstructions";

interface Props {
  recipe?: Recipe; // The recipe to add (could be Spoonacular or user recipe)
  plan: MealPlan; // Current meal plan
  mealType: MealType; // Breakfast, lunch, or dinner
  onClose: () => void; // Close modal
  onAdd?: (mealType: MealType, recipe: Recipe) => void; // Optional callback to update parent state immediately
}

export default function AddToMealPlanModal({ recipe, plan, mealType, onClose, onAdd }: Props) {
  const { updateMeal } = useMealPlans(); // Meal plan context for backend updates
  const { addRecipe } = useRecipes(); // Recipe context to save temporary Spoonacular recipes
  const [loading, setLoading] = useState(false); // Loading state for async operations

  // -----------------------------
  // Add recipe to meal plan
  // -----------------------------
  const handleAdd = async () => {
    if (!plan.id || !recipe) return;

    setLoading(true);
    try {
      let recipeToAdd: Recipe;

      // If recipe is from Spoonacular and not saved, save temporarily
      if (recipe.source === "spoonacular" && !recipe.id?.startsWith("db_")) {
        recipeToAdd = await addRecipe(
          {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            image: recipe.image,
            source: "spoonacular",
            temporary: true, // mark as temporary
            linkedMealPlanIds: [plan.id],
          },
          true // ensure marked as temporary
        );
      } else {
        // Already saved recipe (user-created or previously saved)
        recipeToAdd = recipe;

        // Ensure this meal plan ID is linked
        if (plan.id && !recipeToAdd.linkedMealPlanIds?.includes(plan.id)) {
          recipeToAdd.linkedMealPlanIds = [
            ...(recipeToAdd.linkedMealPlanIds || []),
            plan.id,
          ];
        }
      }

      // Update meal plan in backend for today
      const today = new Date().toISOString().split("T")[0];
      await updateMeal(plan.id, today, mealType, recipeToAdd.id);

      // Call parent callback to update UI immediately
      if (onAdd) onAdd(mealType, recipeToAdd);

      onClose(); // Close the modal after adding
    } catch (err) {
      console.error("Failed to add recipe to meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      {/* Modal header */}
      <h3>
        Add {recipe ? <strong>{recipe.title}</strong> : "a recipe"} to{" "}
        <strong>{plan.title}</strong> ({mealType})
      </h3>

      {/* Instructions section */}
      {recipe ? (
        <div style={{ margin: "1rem 0", whiteSpace: "pre-wrap" }}>
          {parseInstructions(recipe.instructions)}
        </div>
      ) : (
        <p>Please select a recipe to add.</p>
      )}

      {/* Action buttons */}
      {recipe && (
        <button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add to Meal Plan"}
        </button>
      )}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
