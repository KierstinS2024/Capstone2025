// ===========================================
// PATH: src/app/shopping-list/from-meal-plan/page.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes } from "@/context/RecipeContext";
import { MealPlan } from "@/types/mealPlan";
import { Recipe } from "@/types/recipe";

// Page to add ingredients from a selected meal plan into the shopping list
export default function FromMealPlanPage() {
  const { mealPlans, loading: mealPlansLoading } = useMealPlans();
  const { addBulk, loading: shoppingLoading } = useShoppingList();
  const { recipes } = useRecipes();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mealPlansLoading) return <div>Loading meal plans...</div>;

  // Find the selected plan
  const selectedPlan: MealPlan | undefined = mealPlans.find(
    (p) => p.id === selectedPlanId
  );

  // Extract all ingredients from all meals in the plan
  const ingredients: string[] = selectedPlan
    ? Object.values(selectedPlan.meals).flatMap((day) =>
        Object.values(day)
          .filter(Boolean)
          .flatMap((recipeId) => {
            const recipe: Recipe | undefined = recipes.find(
              (r) => r.id === recipeId
            );
            return recipe ? recipe.ingredients : [];
          })
      )
    : [];

  const handleAddIngredients = async () => {
    if (!selectedPlan || ingredients.length === 0) return;
    setAdding(true);
    setError(null);
    try {
      await addBulk(ingredients); // Add all ingredients to shopping list
    } catch (err) {
      console.error(err);
      setError("Failed to add ingredients.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Add Ingredients from Meal Plan
      </h1>

      {/* Select Meal Plan Dropdown */}
      <select
        value={selectedPlanId || ""}
        onChange={(e) => setSelectedPlanId(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select a Meal Plan</option>
        {mealPlans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.id} {/* You can replace with a friendly title */}
          </option>
        ))}
      </select>

      {/* Ingredient Preview */}
      {selectedPlan && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Ingredients:</h2>
          {ingredients.length ? (
            <ul className="list-disc pl-5">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          ) : (
            <p>No recipes found in this plan.</p>
          )}
        </div>
      )}

      {/* Add Ingredients Button */}
      <button
        onClick={handleAddIngredients}
        disabled={
          !selectedPlan || adding || shoppingLoading || ingredients.length === 0
        }
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {adding ? "Adding..." : "Add All Ingredients to Shopping List"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
