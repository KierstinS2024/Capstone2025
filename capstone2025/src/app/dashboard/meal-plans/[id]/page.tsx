// Path: src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * ViewMealPlanPage
 * ----------------
 * Displays a single meal plan.
 * Features:
 * - Protected route
 * - Fetches meal plan by ID
 * - Lists all entries (recipes) for the week
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MealPlanFormSchema } from "@/components/MealPlanForm";

export default function ViewMealPlanPage() {
  return (
    <ProtectedRoute>
      <MealPlanViewWrapper />
    </ProtectedRoute>
  );
}

function MealPlanViewWrapper() {
  const { id } = useParams();
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlanFormSchema | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch meal plan data on mount
  useEffect(() => {
    if (!id) return;

    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`/api/meal-plans/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch meal plan");

        const data = await res.json();
        setMealPlan(data.data);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Unexpected error");
        router.push("/dashboard/meal-plans"); // redirect if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [id, router]);

  if (loading) return <p>Loading meal plan...</p>;
  if (!mealPlan) return <p>Meal plan not found.</p>;

  return (
    <div>
      <h1>
        Meal Plan for Week Starting{" "}
        {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h1>
      {mealPlan.notes && <p>Notes: {mealPlan.notes}</p>}
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Meal Type</th>
            <th>Recipe</th>
            <th>Servings</th>
          </tr>
        </thead>
        <tbody>
          {mealPlan.entries.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.dayOfWeek}</td>
              <td>{entry.mealType}</td>
              <td>{entry.recipeId || "Custom / Unknown"}</td>
              <td>{entry.servings}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => router.push(`/dashboard/meal-plans/${id}/edit`)}>
        Edit Meal Plan
      </button>
    </div>
  );
}
