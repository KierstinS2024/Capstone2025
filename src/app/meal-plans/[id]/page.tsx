// path: src/app/meal-plans/[id]/page.tsx
/**
 * MealPlanDetailPage
 * Displays a single meal plan with all entries (recipes per day/meal)
 * Allows generating a shopping list from this meal plan
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Entry {
  _id: string;
  recipeId: string;
  dayOfWeek: string;
  mealType: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries: Entry[];
}

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    if (id) fetchMealPlan();
  }, [id]);

  const fetchMealPlan = async () => {
    const res = await fetch(`/api/meal-plans/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMealPlan(data.data || null);
  };

  const generateShoppingList = async () => {
    const res = await fetch(`/api/shopping-lists/from-meal-plan/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.shoppingList) {
      router.push(`/shopping-lists/${data.shoppingList._id}`);
    }
  };

  if (!mealPlan) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Meal Plan: Week of {new Date(mealPlan.weekStartDate).toDateString()}
      </h1>

      {mealPlan.notes && <p className="mb-4">{mealPlan.notes}</p>}

      <button
        onClick={generateShoppingList}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Shopping List
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealPlan.entries.map((entry) => (
          <div key={entry._id} className="border p-4 rounded">
            <p>
              <strong>
                {entry.dayOfWeek} - {entry.mealType}
              </strong>
            </p>
            <p>Recipe ID: {entry.recipeId}</p>
            <p>Servings: {entry.servings}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
