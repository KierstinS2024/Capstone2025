// ===========================================
// PATH: src/components/AddToMealPlanModal.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";

/**
 * AddToMealPlanModal
 * - Adds a specific recipe to the user's active meal plan
 * - Handles missing active plan or user gracefully
 */
interface Props {
  recipeId: string;
  onClose: () => void;
}

export default function AddToMealPlanModal({ recipeId, onClose }: Props) {
  const { user } = useAuth();
  const { activePlan, addRecipeToPlan } = useMealPlans();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!user?.email) {
      alert("You must be logged in to add a recipe.");
      return;
    }

    if (!activePlan) {
      alert("No active meal plan found. Please create one first.");
      return;
    }

    setLoading(true);
    try {
      await addRecipeToPlan(recipeId, user.email);
      onClose();
    } catch (err) {
      console.error("Failed to add recipe to meal plan:", err);
      alert("Failed to add recipe to meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add to Meal Plan"}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
