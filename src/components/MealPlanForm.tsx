// Path: src/components/MealPlanForm.tsx
"use client";

import React, { useState } from "react";
import type { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import { useMealPlan } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";

interface MealPlanFormProps {
  existingPlan?: MealPlan; // Optional for editing an existing plan
  onClose: () => void; // Close modal or form
}

/**
 * MealPlanForm
 * Handles creation and editing of a meal plan.
 * Supports adding/removing entries and selecting recipes.
 */
export const MealPlanForm: React.FC<MealPlanFormProps> = ({
  existingPlan,
  onClose,
}) => {
  const { createMealPlan } = useMealPlan();
  const { recipes } = useRecipes();

  // Local form state
  const [title, setTitle] = useState(existingPlan?.title || "");
  const [startDate, setStartDate] = useState(
    existingPlan?.startDate.slice(0, 10) || ""
  );
  const [endDate, setEndDate] = useState(
    existingPlan?.endDate.slice(0, 10) || ""
  );
  const [entries, setEntries] = useState<MealPlanEntry[]>(
    existingPlan?.entries || []
  );

  /** Add a new entry defaulting to first recipe if available */
  const addEntry = () => {
    if (!recipes.length) {
      alert("No recipes available to add.");
      return;
    }
    const newEntry: MealPlanEntry = {
      date: startDate,
      mealType: "Breakfast",
      recipeId: recipes[0]._id,
      ingredients: recipes[0].ingredients.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        category: "other",
      })),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  /** Update a specific entry */
  const updateEntry = (index: number, updated: Partial<MealPlanEntry>) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updated } : e))
    );
  };

  /** Remove an entry */
  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  /** Submit the meal plan */
  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) {
      alert("Title, start date, and end date are required.");
      return;
    }

    const payload: Partial<MealPlan> = { title, startDate, endDate, entries };
    await createMealPlan(payload);
    onClose();
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 24,
        borderRadius: 8,
        minWidth: 400,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h2 className="text-xl font-bold mb-4">
        {existingPlan ? "Edit Meal Plan" : "New Meal Plan"}
      </h2>

      {/* Title */}
      <div className="mb-2">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Dates */}
      <div className="mb-2 flex gap-2">
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Entries */}
      <div className="mb-2">
        <h3 className="font-semibold mb-1">Entries</h3>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="entry flex items-center gap-2 mb-1 border-b pb-1"
          >
            {/* Meal Type */}
            <select
              value={entry.mealType}
              onChange={(e) =>
                updateEntry(idx, {
                  mealType: e.target.value as MealPlanEntry["mealType"],
                })
              }
              className="border px-2 py-1 rounded"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>

            {/* Recipe selection */}
            <select
              value={entry.recipeId}
              onChange={(e) => updateEntry(idx, { recipeId: e.target.value })}
              className="border px-2 py-1 rounded flex-1"
            >
              {recipes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>

            {/* Remove entry */}
            <button
              onClick={() => removeEntry(idx)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add new entry */}
        <button
          onClick={addEntry}
          className="mt-1 px-3 py-1 bg-green-500 text-white rounded"
        >
          Add Entry
        </button>
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Save Plan
        </button>
      </div>
    </div>
  );
};
