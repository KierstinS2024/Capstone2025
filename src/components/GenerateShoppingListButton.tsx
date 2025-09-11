// src/components/GenerateShoppingListButton.tsx
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import type {
  CreateShoppingListPayload,
  ShoppingCategory,
} from "@/types/shoppingList";
import type { MealIngredient } from "@/types/mealPlan";

/**
 * GenerateShoppingListButton
 * Generates a shopping list from the current meal plan
 */
export const GenerateShoppingListButton: React.FC = () => {
  const { currentMealPlan } = useMealPlan();
  const [loading, setLoading] = useState(false);

  if (!currentMealPlan) return null; // nothing to generate

  /** Safely map a string (optional) to ShoppingCategory */
  const mapCategory = (category?: string): ShoppingCategory => {
    switch (category) {
      case "produce":
      case "meat":
      case "dairy":
      case "frozen":
      case "other":
        return category;
      default:
        return "other";
    }
  };

  /** Convert a MealIngredient to a ShoppingItem */
  const mapIngredientToShoppingItem = (ingredient: MealIngredient) => ({
    ingredient: ingredient.name,
    quantity: ingredient.quantity,
    category: mapCategory(ingredient.category),
    checked: false,
  });

  /** Handle generating the shopping list */
  const handleGenerate = async () => {
    if (!currentMealPlan.entries.length) {
      alert("Meal plan has no entries to generate a shopping list.");
      return;
    }

    setLoading(true);

    try {
      // Flatten all ingredients from all meal plan entries
      const allIngredients = currentMealPlan.entries.flatMap((entry) =>
        entry.ingredients.map(mapIngredientToShoppingItem)
      );

      const payload: CreateShoppingListPayload = {
        title: `${currentMealPlan.title} Shopping List`,
        items: allIngredients,
      };

      // Call our fixed server API
      const response = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create shopping list");

      alert("Shopping list generated successfully!");
    } catch (error: any) {
      console.error("Error generating shopping list:", error);
      alert(`Error generating shopping list: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      style={{
        padding: "6px 12px",
        backgroundColor: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {loading ? "Generating..." : "Generate Shopping List"}
    </button>
  );
};
