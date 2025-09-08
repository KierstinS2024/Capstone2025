// Path: src/app/dashboard/meal-plans/new/page.tsx
"use client";

/**
 * NewMealPlanPage
 * -----------------
 * Page to create a new meal plan.
 * Features:
 * - Protected route
 * - Uses reusable MealPlanForm
 * - Sends POST to /api/meal-plans
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import MealPlanForm, {
  type MealPlanFormSchema,
} from "@/components/MealPlanForm";

export default function NewMealPlanPage() {
  return (
    <ProtectedRoute>
      <NewMealPlanFormWrapper />
    </ProtectedRoute>
  );
}

function NewMealPlanFormWrapper() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: MealPlanFormSchema) => {
    setLoading(true);
    try {
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create meal plan");
      }

      const result = await res.json();
      router.push(`/dashboard/meal-plans/${result.data._id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return <MealPlanForm onSubmit={handleSubmit} loading={loading} />;
}
