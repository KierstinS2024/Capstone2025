// path: src/app/shopping-list/from-meal-plan/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "@/styles/shoppingList.css";

export default function GenerateFromMealPlan() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { mealPlans } = useMealPlan();
  const { addItem } = useShoppingList();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const handleGenerate = async () => {
    if (!selectedPlanId) return;
    const plan = mealPlans.find((p) => p._id === selectedPlanId);
    if (!plan) return;

    setGenerating(true);
    try {
      for (const meal of plan.meals) {
        if (meal.ingredients) {
          for (const ing of meal.ingredients) {
            await addItem(ing.name, ing.category || "other");
          }
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || !user) return <p className="loading">Loading...</p>;

  return (
    <div className="shopping-list-page">
      <h1 className="page-title">Generate Shopping List from Meal Plan</h1>

      {mealPlans.length === 0 ? (
        <p className="empty-state">No meal plans available to generate from.</p>
      ) : (
        <>
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="select"
          >
            <option value="">Select a meal plan</option>
            {mealPlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.date} — {plan.name || "Unnamed Plan"}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            className="button"
            disabled={!selectedPlanId || generating}
            style={{ marginTop: "1rem" }}
          >
            {generating ? "Generating..." : "Generate Shopping List"}
          </button>
        </>
      )}
    </div>
  );
}
