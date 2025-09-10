// src/components/MealPlanCard.tsx
// Displays the current meal plan with options to delete or generate a shopping list

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { generateShoppingListFromMealPlanAPI } from "@/lib/shoppingListApi";
import type { ShoppingList } from "@/types/shoppingList";

export const MealPlanCard: React.FC = () => {
  const {
    currentMealPlan,
    deleteMealPlan,
    fetchMealPlans,
    setCurrentMealPlan,
  } = useMealPlan();
  const [generating, setGenerating] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

  if (!currentMealPlan) {
    return <div>No active meal plan. Create one to get started!</div>;
  }

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete the meal plan "${currentMealPlan.title}"?`
      )
    ) {
      await deleteMealPlan(currentMealPlan._id);
      setCurrentMealPlan(null);
    }
  };

  const handleGenerateShoppingList = async () => {
    setGenerating(true);
    try {
      const list = await generateShoppingListFromMealPlanAPI(
        currentMealPlan._id
      );
      setShoppingList(list);
      alert(`Shopping list "${list.title}" generated!`);
    } catch (err) {
      console.error("Error generating shopping list:", err);
      alert("Failed to generate shopping list");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="meal-plan-card p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold">{currentMealPlan.title}</h2>
      <p className="text-sm text-gray-500">
        {new Date(currentMealPlan.startDate).toLocaleDateString()} -{" "}
        {new Date(currentMealPlan.endDate).toLocaleDateString()}
      </p>

      <div className="entries mt-2">
        {currentMealPlan.entries.map((entry) => (
          <div
            key={entry.date + entry.mealType}
            className="entry border-t py-1 flex justify-between"
          >
            <span className="meal-type font-medium">{entry.mealType}</span>
            <span className="recipe-id text-gray-700">
              Recipe ID: {entry.recipeId}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete Plan
        </button>

        <button
          onClick={handleGenerateShoppingList}
          disabled={generating}
          className={`px-3 py-1 rounded text-white ${
            generating ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {generating ? "Generating..." : "Generate Shopping List"}
        </button>
      </div>

      {shoppingList && (
        <div className="shopping-list mt-3 p-2 border rounded bg-gray-50">
          <h3 className="font-semibold">{shoppingList.title}</h3>
          <ul className="list-disc pl-5">
            {shoppingList.items.map((item, idx) => (
              <li key={idx}>
                {item.ingredient} - {item.quantity} ({item.category})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
