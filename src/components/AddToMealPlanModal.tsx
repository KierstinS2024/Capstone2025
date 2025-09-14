// path: src/components/AddToMealPlanModal.tsx
"use client";

import React, { useState } from "react";
import { Meal } from "@/types/mealPlan";
import { useMealPlan } from "@/context/MealPlanContext";
import "@/styles/addToMealPlanModal.css";

interface AddToMealPlanModalProps {
  recipeId: string;
  recipeName: string;
  recipeImage?: string;
  onClose: () => void;
}

export default function AddToMealPlanModal({
  recipeId,
  recipeName,
  recipeImage,
  onClose,
}: AddToMealPlanModalProps) {
  const { addMealToPlan } = useMealPlan();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">(
    "breakfast"
  );
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const meal: Meal = {
        id: crypto.randomUUID(),
        type: mealType,
        date: selectedDate,
        name: recipeName,
        recipeId,
        image: recipeImage,
        source: "spoonacular",
      };
      await addMealToPlan(meal, selectedDate);
      onClose();
    } catch (err) {
      console.error("Failed to add meal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Add to Meal Plan</h3>
        {recipeImage && (
          <img src={recipeImage} alt={recipeName} className="recipe-thumb" />
        )}
        <p>{recipeName}</p>

        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <label>
          Meal Type:
          <select
            value={mealType}
            onChange={(e) =>
              setMealType(e.target.value as "breakfast" | "lunch" | "dinner")
            }
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
