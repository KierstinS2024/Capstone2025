"use client";

import { Recipe } from "@/types/recipe";
import { useMealPlans } from "@/context/MealPlanContext";
import { MealType } from "@/lib/mealPlanApi";

interface Props {
  recipe: Recipe;
}

export default function AddToMealPlan({ recipe }: Props) {
  const { mealPlans, updateMeal } = useMealPlans();

  const handleAdd = (planId: string, mealType: MealType = "breakfast") => {
    if (!recipe._id) {
      console.error("Recipe ID is missing!");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    updateMeal(planId, today, mealType, recipe._id);
  };

  return (
    <div>
      <h4>Add to Meal Plan</h4>
      {mealPlans.map((plan) => (
        <div key={plan.id} style={{ marginBottom: "0.5rem" }}>
          <span>
            {plan.startDate} → {plan.endDate}
          </span>
          <div>
            {(["breakfast", "lunch", "dinner"] as MealType[]).map(
              (mealType) => (
                <button
                  key={mealType}
                  onClick={() => handleAdd(plan.id, mealType)}
                  style={{ marginRight: "0.5rem" }}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
