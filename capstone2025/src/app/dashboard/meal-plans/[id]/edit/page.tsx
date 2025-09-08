// Path: src/app/dashboard/meal-plans/[id]/edit/page.tsx
"use client";

/**
 * EditMealPlanPage
 * -----------------
 * Page to edit an existing meal plan.
 * Features:
 * - Protected route
 * - Loads meal plan by ID
 * - Uses MealPlanForm
 * - Sends PUT to /api/meal-plans/[id]
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import MealPlanForm, {
  type MealPlanFormSchema,
} from "@/components/MealPlanForm";

export default function EditMealPlanPage() {
  return (
    <ProtectedRoute>
      <EditMealPlanFormWrapper />
    </ProtectedRoute>
  );
}

function EditMealPlanFormWrapper() {
  const router = useRouter();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<MealPlanFormSchema | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`/api/meal-plans/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch meal plan");

        const data = await res.json();
        setInitialValues(data.data);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Unexpected error");
      }
    };

    fetchMealPlan();
  }, [id]);

  const handleSubmit = async (data: MealPlanFormSchema) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
              throw new Error(errData.message || "Failed to update meal plan");
      }

      // Redirect to the meal plan view page after successful update
      router.push(`/dashboard/meal-plans/${id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until initialValues are fetched
  if (!initialValues) return <p>Loading meal plan...</p>;

  // Render MealPlanForm with fetched initialValues
  return (
    <MealPlanForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}