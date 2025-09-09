// path: src/components/GenerateShoppingListButton.tsx

"use client";

import { useState } from "react";
import styles from "./GenerateShoppingListButton.module.css";

/**
 * Props for the GenerateShoppingListButton component
 * @param mealPlanId - The ID of the meal plan from which to generate the shopping list
 * @param onSuccess - Optional callback fired when the shopping list is successfully generated
 */
interface GenerateShoppingListButtonProps {
  mealPlanId: string;
  onSuccess?: (shoppingListId: string) => void;
}

/**
 * GenerateShoppingListButton
 *
 * Renders a button that, when clicked, calls the backend API to generate a shopping list
 * for the provided meal plan. Handles loading state, error messages, and success notifications.
 */
export default function GenerateShoppingListButton({
  mealPlanId,
  onSuccess,
}: GenerateShoppingListButtonProps) {
  // Track if API call is in progress
  const [isLoading, setIsLoading] = useState(false);

  // Store error message returned from API
  const [error, setError] = useState<string | null>(null);

  // Store success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * handleGenerate
   *
   * Triggered when the user clicks the button. Sends a POST request to the backend
   * to generate a shopping list from the given meal plan.
   */
  async function handleGenerate() {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

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

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate shopping list.");
      }

      // Notify parent with the new shopping list ID
      if (onSuccess) onSuccess(data.list._id);

      setSuccessMessage("Shopping list generated successfully!");
    } catch (err) {
      console.error("Error generating shopping list:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  }

  return (
    <div>
      {/* Main action button */}
      <button
        className={styles.button}
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Shopping List"}
      </button>

      {/* Error feedback */}
      {error && <p className={styles.messageError}>{error}</p>}

      {/* Success feedback */}
      {successMessage && (
        <p className={styles.messageSuccess}>{successMessage}</p>
      )}
    </div>
  );
}
