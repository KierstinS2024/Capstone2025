// src/components/GenerateShoppingListButton.tsx
// Button to generate a shopping list from the current meal plan
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingLists } from "@/context/ShoppingListContext";
import { generateShoppingListFromMealPlanAPI } from "@/lib/shoppingListApi";

/**
 * GenerateShoppingListButton
 * Calls API to create a shopping list from the current meal plan
 * Adds it to ShoppingListContext
 */
export const GenerateShoppingListButton: React.FC = () => {
  const { currentMealPlan } = useMealPlan();
  const { addShoppingList } = useShoppingLists();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentMealPlan) {
    return (
      <div style={{ color: "gray", fontStyle: "italic" }}>
        No active meal plan to generate a shopping list.
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newList = await generateShoppingListFromMealPlanAPI(
        currentMealPlan._id
      );
      // Add the generated list to context
      addShoppingList(newList);
    } catch (err: any) {
      console.error("Failed to generate shopping list:", err);
      setError(err.message || "Failed to generate shopping list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Generating..." : "Generate Shopping List"}
      </button>
      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>Error: {error}</p>
      )}
    </div>
  );
};
