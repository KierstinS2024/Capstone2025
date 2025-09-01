// path: src/components/GenerateShoppingListButton.tsx
/**
 * GenerateShoppingListButton
 *
 * Button component to generate a shopping list from a given meal plan.
 * Features:
 * - Sends a POST request to /api/shopping-lists/from-meal-plan/:mealPlanId
 * - Shows loading and disables button while request is in progress
 * - Handles success and error states gracefully
 * - Optionally triggers a callback after creation to refresh UI
 */

"use client";

import { useState } from "react";

interface GenerateShoppingListButtonProps {
  mealPlanId: string;
  onSuccess?: (newListId: string) => void; // Callback to refresh or navigate
}

export default function GenerateShoppingListButton({
  mealPlanId,
  onSuccess,
}: GenerateShoppingListButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler to generate shopping list
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to generate a shopping list.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `/api/shopping-lists/from-meal-plan/${mealPlanId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Call optional callback for UI refresh
        if (onSuccess) {
          onSuccess(data.list._id);
        }
        alert("Shopping list generated successfully!");
      } else {
        setError(data.message || "Failed to generate shopping list.");
      }
    } catch (err) {
      console.error("Error generating shopping list:", err);
      setError("Server error while generating shopping list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Shopping List"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>Error: {error}</p>
      )}
    </div>
  );
}
