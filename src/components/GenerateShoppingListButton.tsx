// path: src/components/GenerateShoppingListButton.tsx
/**
 * GenerateShoppingListButton
 *
 * A reusable button component that triggers the creation of a shopping list
 * for a specific meal plan. It handles API communication, loading state,
 * and success/error feedback to the user.
 */

"use client";

import { useState } from "react";
import styles from "./GenerateShoppingListButton.module.css"; // assume we will create minimal styling

interface Props {
  mealPlanId: string; // the meal plan for which we want to generate the shopping list
  onSuccess?: (shoppingListId: string) => void; // optional callback after success
}

export default function GenerateShoppingListButton({
  mealPlanId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handler to generate shopping list
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Shopping list created successfully!");
        // call optional callback
        if (onSuccess && data.shoppingList?._id) {
          onSuccess(data.shoppingList._id);
        }
      } else {
        setError(data.message || "Failed to generate shopping list");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while generating shopping list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Shopping List"}
      </button>

      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
