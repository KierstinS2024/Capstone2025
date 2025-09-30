// ===========================================
// PATH: src/components/AddMealForm.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/addMealForm.module.css";

/**
 * AddMealForm
 * - Allows a logged-in user to add a recipe to their active meal plan
 * - Validates inputs and prevents errors if activePlan or meals are missing
 */
export default function AddMealForm() {
  const { user } = useAuth();
  const { activePlan, addMealToPlan } = useMealPlans();
  const { recipes } = useRecipes();

  // -----------------------------
  // Local form state
  // -----------------------------
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Handle form submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      setError("You must be logged in to add a meal.");
      return;
    }

    if (!activePlan) {
      setError("No active meal plan found. Please create one first.");
      return;
    }

    if (!selectedRecipeId || !selectedDate || !selectedMealType) {
      setError("Please select a date, meal type, and recipe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add the meal safely
      await addMealToPlan(selectedDate, selectedMealType, selectedRecipeId);

      alert("Meal added successfully!");

      // Reset form
      setSelectedRecipeId("");
      setSelectedMealType("breakfast");
      setSelectedDate("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add meal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add Meal to Plan</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label>
        Date
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </label>

      <label>
        Meal Type
        <select
          value={selectedMealType}
          onChange={(e) =>
            setSelectedMealType(
              e.target.value as "breakfast" | "lunch" | "dinner"
            )
          }
          required
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </label>

      <label>
        Recipe
        <select
          value={selectedRecipeId}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
          required
        >
          <option value="">-- Select a recipe --</option>
          {recipes.length === 0 ? (
            <option disabled>No recipes available</option>
          ) : (
            recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title}
              </option>
            ))
          )}
        </select>
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Meal"}
      </button>
    </form>
  );
}
