// src/components/MealPlanForm.tsx
// MealPlan creation form with recipe selection
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import type { MealType, MealPlanEntry } from "@/types/mealPlan";
import type { Recipe } from "@/types/recipe";

// --------------------
// Types
// --------------------
interface MealEntryInput {
  mealType: MealType;
  date: string;
  recipeId: string;
}

// --------------------
// MealPlanForm Component
// --------------------
export const MealPlanForm: React.FC = () => {
  const { createMealPlan } = useMealPlan();
  const { recipes } = useRecipes();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState<MealEntryInput[]>([]);

  // Add new empty meal entry
  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { mealType: "breakfast", date: startDate || "", recipeId: "" },
    ]);
  };

  // Update a single entry
  const updateEntry = (index: number, updated: Partial<MealEntryInput>) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updated } : e))
    );
  };

  // Remove entry
  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit meal plan
  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) {
      alert("Fill all fields");
      return;
    }

    // Convert MealEntryInput to MealPlanEntry
    const mealPlanEntries: MealPlanEntry[] = entries.map((e) => ({
      date: e.date,
      mealType: e.mealType,
      recipeId: e.recipeId,
      ingredients: [], // optional, will be filled when generating shopping list
    }));

    await createMealPlan({
      title,
      startDate,
      endDate,
      entries: mealPlanEntries,
    });

    // Reset form
    setTitle("");
    setStartDate("");
    setEndDate("");
    setEntries([]);
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Create Meal Plan</h2>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Meal Plan Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full mb-1"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1 w-full mb-1"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Meal Entries</h3>
        {entries.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mb-2 border p-2 rounded"
          >
            <select
              value={entry.mealType}
              onChange={(e) =>
                updateEntry(index, { mealType: e.target.value as MealType })
              }
              className="border p-1"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <input
              type="date"
              value={entry.date}
              onChange={(e) => updateEntry(index, { date: e.target.value })}
              className="border p-1"
            />

            <select
              value={entry.recipeId}
              onChange={(e) => updateEntry(index, { recipeId: e.target.value })}
              className="border p-1 flex-1"
            >
              <option value="">-- Select Recipe --</option>
              {recipes.map((r: Recipe) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeEntry(index)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addEntry}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Entry
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Meal Plan
      </button>
    </div>
  );
};
