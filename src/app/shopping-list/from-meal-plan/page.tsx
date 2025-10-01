// ===========================================
// PATH: src/app/shopping-list/from-meal-plan/page.tsx
// ===========================================
// Page: Add ingredients from a selected meal plan
// -----------------------------
// - Allows the user to select a meal plan
// - Extracts all ingredients from recipes in that plan
// - Adds them to the user's single shopping list via addBulk
// - Provides loading, error, and feedback states
// ===========================================

"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes } from "@/context/RecipeContext";
import { MealPlan } from "@/types/mealPlan";
import { Recipe } from "@/types/recipe";

export default function FromMealPlanPage() {
  // -----------------------------
  // Load meal plans, recipes, and shopping list context
  // -----------------------------
  const { mealPlans, loading: mealPlansLoading } = useMealPlans();
  const { addBulk, loading: shoppingLoading } = useShoppingList();
  const { recipes } = useRecipes();

  // -----------------------------
  // Component state
  // -----------------------------
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [addingIngredients, setAddingIngredients] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Show loading while meal plans are fetching
  // -----------------------------
  if (mealPlansLoading) return <p>Loading meal plans...</p>;

  // -----------------------------
  // Find the selected meal plan object
  // -----------------------------
  const selectedPlan: MealPlan | undefined = mealPlans.find(
    (plan) => plan.id === selectedPlanId
  );

  // -----------------------------
  // Extract all ingredients from all recipes in the selected plan
  // -----------------------------
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

  // -----------------------------
  // Add all ingredients to shopping list
  // -----------------------------
  const handleAddIngredients = async () => {
    if (!selectedPlan || ingredients.length === 0) return;

    setAddingIngredients(true);
    setErrorMessage(null);

    try {
      await addBulk(ingredients); // Adds all items optimistically
    } catch (err) {
      console.error("Failed to add ingredients:", err);
      setErrorMessage("Failed to add ingredients. Please try again.");
    } finally {
      setAddingIngredients(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Add Ingredients from Meal Plan</h1>

      {/* Select a Meal Plan */}
      <label>
        Choose a Meal Plan:
        <select
          value={selectedPlanId || ""}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
        >
          <option value="">-- Select a Meal Plan --</option>
          {mealPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.id} {/* Replace with friendly title if available */}
            </option>
          ))}
        </select>
      </label>

      {/* Ingredient Preview */}
      {selectedPlan && (
        <section style={{ marginBottom: "1rem" }}>
          <h2>Ingredients in this plan:</h2>
          {ingredients.length ? (
            <ul style={{ paddingLeft: "1.5rem" }}>
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p>No recipes found in this plan.</p>
          )}
        </section>
      )}

      {/* Add Ingredients Button */}
      <button
        onClick={handleAddIngredients}
        disabled={
          !selectedPlan ||
          addingIngredients ||
          shoppingLoading ||
          ingredients.length === 0
        }
        style={{
          padding: "0.5rem 1rem",
          cursor: addingIngredients ? "not-allowed" : "pointer",
          opacity: !selectedPlan || addingIngredients ? 0.5 : 1,
        }}
      >
        {addingIngredients
          ? "Adding..."
          : "Add All Ingredients to Shopping List"}
      </button>

      {/* Error Message */}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>
      )}
    </main>
  );
}
