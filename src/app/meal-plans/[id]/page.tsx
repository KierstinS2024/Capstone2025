// path: src/app/meal-plans/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import MealCard from "@/components/MealCard";
import "@/styles/mealplan-detail.css";

export default function MealPlanDetailPage() {
  const { id: planId } = useParams<{ id: string }>();
  const router = useRouter();

  const { mealPlans, addMealToPlan, removeMealFromPlan } = useMealPlan();
  const { addItem } = useShoppingList();

  const [mealPlan, setMealPlan] = useState(
    mealPlans.find((p) => p.id === planId) || null
  );

  // Update local state if mealPlans changes
  useEffect(() => {
    const foundPlan = mealPlans.find((p) => p.id === planId) || null;
    setMealPlan(foundPlan);
  }, [mealPlans, planId]);

  if (!mealPlan) return <p>Loading meal plan...</p>;

  const handleAddAllIngredients = () => {
    mealPlan.meals.forEach((meal) => {
      meal.ingredients?.forEach((ing) => {
        addItem(ing.name, "other");
      });
    });
  };

  return (
    <div className="mealplan-detail-page">
      <div className="plan-header">
        <h2>
          Meal Plan ({mealPlan.startDate} - {mealPlan.endDate})
        </h2>
        <button className="add-all-button" onClick={handleAddAllIngredients}>
          Add All Ingredients to Shopping List
        </button>
      </div>

      <div className="meals-grid">
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = mealPlan.meals.find((m) => m.type === type);
          return (
            <MealCard
              key={type}
              type={type}
              meal={meal || null}
              onRemove={(mealId: string) =>
                removeMealFromPlan(mealPlan.id, mealId)
              }
              onOpen={(meal) => console.log("Open recipe", meal)}
            />
          );
        })}
      </div>

      <button
        className="back-button"
        onClick={() => router.push("/meal-plans")}
      >
        Back to All Meal Plans
      </button>
    </div>
  );
}
