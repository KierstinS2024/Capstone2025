// src/components/GenerateShoppingList.tsx
"use client";

import React from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function GenerateShoppingList() {
  const { getAllMealNames } = useMealPlan();
  const { addMultipleItems } = useShoppingList();

  const handleGenerate = async () => {
    const names = getAllMealNames();
    await addMultipleItems(names);
  };

  return (
    <button className="generate-button" onClick={handleGenerate}>
      Generate Shopping List from Meal Plans
    </button>
  );
}
