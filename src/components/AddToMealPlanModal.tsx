// src/components/AddToMealPlanModal.tsx
"use client";

import React, { useState } from "react";
import { Meal } from "@/types/mealPlan";
import { useMealPlan } from "@/context/MealPlanContext";

interface AddToMealPlanModalProps {
  meal: Meal;
  onClose: () => void;
}

export default function AddToMealPlanModal({
  meal,
  onClose,
}: AddToMealPlanModalProps) {
  const { addMealToPlan } = useMealPlan();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">(
    "breakfast"
  );

  const handleAdd = async () => {
    await addMealToPlan({ ...meal, type: mealType }, selectedDate);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Add {meal.name} to Meal Plan</h3>
        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Type:
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as any)}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={handleAdd}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
