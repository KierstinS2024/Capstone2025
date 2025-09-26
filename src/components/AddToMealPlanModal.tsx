// ===========================================
// PATH: src/components/AddToMealPlanModal.tsx
// Modal for adding an existing recipe to a meal plan
// - Allows selecting breakfast/lunch/dinner
// - Directly updates the MealPlanContext
// - No temporary recipe logic
// ===========================================

"use client";

import React, { useState } from "react";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { Recipe } from "@/types/recipe";
import { parseInstructions } from "@/utils/parseInstructions";

interface Props {
  recipe?: Recipe; // Recipe to add
  plan: MealPlan; // Target meal plan
  onClose: () => void; // Close modal
  onAdd?: (mealType: MealType, recipe: Recipe) => void; // Callback after adding
}

export default function AddToMealPlanModal({
  recipe,
  plan,
  onClose,
  onAdd,
}: Props) {
  const { updateMeal } = useMealPlans(); // Context to update meal slots
  const [mealType, setMealType] = useState<MealType>("dinner"); // Default selected slot
  const [loading, setLoading] = useState(false); // Loading state while adding

  // -------------------------------------------
  // Add the selected recipe to the chosen meal slot
  // -------------------------------------------
  const handleAdd = async () => {
    if (!plan.id || !recipe) return; // Safety check

    setLoading(true);
    try {
      // Today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Update the meal slot in backend & context
      await updateMeal(plan.id, today, mealType, recipe.id);

      // Callback to parent if provided
      if (onAdd) onAdd(mealType, recipe);

      // Close the modal
      onClose();
    } catch (err) {
      console.error("Failed to add recipe to meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // Render modal
  // -------------------------------------------
  return (
    <div className="modal">
      {/* Header */}
      <h3>
        Add {recipe ? <strong>{recipe.title}</strong> : "a recipe"} to{" "}
        <strong>{plan.title || `${plan.startDate} → ${plan.endDate}`}</strong>
      </h3>

      {/* Meal type selector */}
      <label style={{ display: "block", margin: "1rem 0" }}>
        Meal type:{" "}
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </label>

      {/* Recipe instructions preview */}
      {recipe ? (
        <div style={{ margin: "1rem 0", whiteSpace: "pre-wrap" }}>
          {parseInstructions(recipe.instructions)}
        </div>
      ) : (
        <p>Please select a recipe to add.</p>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: "1rem" }}>
        {recipe && (
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add to Meal Plan"}
          </button>
        )}
        <button onClick={onClose} style={{ marginLeft: "0.5rem" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
