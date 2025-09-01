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
  // State to track if the API call is in progress
  const [isLoading, setIsLoading] = useState(false);

  // State to store any error message returned from the API
  const [error, setError] = useState<string | null>(null);

  // State to store success message (optional)
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
        // Handle API error
        throw new Error(data.message || "Failed to generate shopping list.");
      }

      // Optional callback to parent component with new shopping list ID
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
      {/* Main button */}
      <button
        className={styles.button}
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Shopping List"}
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

      {/* Success message */}
      {successMessage && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>{successMessage}</p>
      )}
    </div>
  );
}
