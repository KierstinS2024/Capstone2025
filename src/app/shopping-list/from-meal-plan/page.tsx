// path: src/app/shopping-list/from-meal-plan/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRouter } from "next/navigation";
import "@/styles/shoppingList.css";

export default function GenerateShoppingListPage() {
  const { user, loading: authLoading } = useAuth();
  const { getAllMealNames } = useMealPlan();
  const { addMultipleItems } = useShoppingList();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const handleGenerateList = async () => {
    const mealNames = getAllMealNames();
    await addMultipleItems(mealNames);
  };

  if (authLoading || !user) return <p className="loading">Loading...</p>;

  return (
    <div className="shopping-list-page">
      <h1 className="page-title">Generate Shopping List from Meal Plans</h1>
      <p className="subtitle">
        Add all ingredients from your meal plans to your shopping list.
      </p>
      <button className="button" onClick={handleGenerateList}>
        Add All Ingredients
      </button>
    </div>
  );
}
