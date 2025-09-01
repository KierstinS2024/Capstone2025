// path: src/components/GenerateShoppingListButton.tsx
/**
 * GenerateShoppingListButton Component
 *
 * A reusable button component that triggers shopping list generation for a given meal plan.
 * - Calls the API route: POST /api/shopping-lists/from-meal-plan/[mealPlanId]
 * - Displays loading state and success/error messages.
 *
 * Props:
 * - mealPlanId: string - The ID of the meal plan to generate the shopping list from
 * - onSuccess?: (shoppingList) => void - Optional callback after successful creation
 */

"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Custom hook to get auth context

interface GenerateShoppingListButtonProps {
  mealPlanId: string;
  onSuccess?: (shoppingList: any) => void;
}

const GenerateShoppingListButton: React.FC<GenerateShoppingListButtonProps> = ({
  mealPlanId,
  onSuccess,
}) => {
  const { token } = useAuth(); // Get JWT token from auth context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/shopping-lists/from-meal-plan/${mealPlanId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate shopping list");
      }

      // Call optional success callback
      if (onSuccess) onSuccess(data.shoppingList);
    } catch (err: any) {
      console.error("Error generating shopping list:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        {loading ? "Generating..." : "Generate Shopping List"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateShoppingListButton;
