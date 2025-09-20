// ===========================================
// PATH: src/app/shopping-list/from-meal-plan/page.tsx
// Shopping List: Add ingredients directly from a selected Meal Plan
// Uses MealPlanContext + ShoppingListContext
// Fully typed, aligned with your current UI/UX
// ===========================================

"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { MealPlan } from "@/types/mealPlan";

// This page assumes the user is already logged in (ProtectedRoute wraps it)

export default function FromMealPlanPage() {
  const { mealPlans, loading: mealPlansLoading } = useMealPlans();
  const { addBulk, loading: shoppingLoading } = useShoppingList();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // -----------------------------
  // Add all ingredients from the selected meal plan
  // -----------------------------
  const handleAddFromPlan = async () => {
    if (!selectedPlanId) return;

    const plan = mealPlans.find((p) => p.id === selectedPlanId);
    if (!plan) return;

    setAdding(true);
    setError(null);

    try {
      // Flatten all recipe IDs from all meals in the plan
      const recipeIds = Object.values(plan.meals)
        .flatMap((slot) => Object.values(slot))
        .filter(Boolean) as string[];

      // Map recipe IDs to ingredient names
      // Here we assume your RecipeContext already has recipes loaded
      // In a real app, this could pull from your recipes context or API
      const ingredients: string[] = recipeIds.map(
        (id) => `Ingredient for recipe ${id}` // placeholder, replace with real ingredient mapping
      );

      // Add all ingredients to the shopping list in bulk
      await addBulk(ingredients);
    } catch (err: any) {
      setError(err.message || "Failed to add items from meal plan");
    } finally {
      setAdding(false);
    }
  };

  if (mealPlansLoading) return <p>Loading meal plans...</p>;

  return (
    <div className="p-4 space-y-4">
      {/* --- Select a Meal Plan --- */}
      <div>
        <label htmlFor="planSelect" className="block font-medium mb-2">
          Select a Meal Plan:
        </label>
        <select
          id="planSelect"
          className="border rounded p-2 w-full"
          value={selectedPlanId ?? ""}
          onChange={(e) => setSelectedPlanId(e.target.value)}
        >
          <option value="">-- Choose a plan --</option>
          {mealPlans.map((plan: MealPlan) => (
            <option key={plan.id} value={plan.id}>
              {plan.title} ({plan.startDate} - {plan.endDate})
            </option>
          ))}
        </select>
      </div>

      {/* --- Add Ingredients Button --- */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleAddFromPlan}
        disabled={!selectedPlanId || adding || shoppingLoading}
      >
        {adding ? "Adding ingredients..." : "Add Ingredients to Shopping List"}
      </button>

      {/* --- Error Display --- */}
      {error && <p className="text-red-600">{error}</p>}

      {/* --- Optional Preview --- */}
      {selectedPlanId && (
        <div className="border rounded p-4 mt-4">
          <h3 className="font-semibold mb-2">Preview Ingredients:</h3>
          <ul className="list-disc pl-5">
            {/* Replace with actual ingredient list from recipes */}
            <li>Ingredient 1</li>
            <li>Ingredient 2</li>
            <li>Ingredient 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}
