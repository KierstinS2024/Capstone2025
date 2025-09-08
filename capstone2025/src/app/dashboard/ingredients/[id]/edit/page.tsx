// Path: src/app/dashboard/ingredients/[id]/edit/page.tsx
"use client";

/**
 * EditIngredientPage
 * -----------------
 * Page for editing an existing ingredient.
 * Features:
 * - Protected route
 * - Loads ingredient by ID
 * - Uses IngredientForm
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import IngredientForm, {
  IngredientFormSchema,
} from "@/components/IngredientForm";

export default function EditIngredientPage() {
  return (
    <ProtectedRoute>
      <EditIngredientFormWrapper />
    </ProtectedRoute>
  );
}

function EditIngredientFormWrapper() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialValues, setInitialValues] =
    useState<IngredientFormSchema | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch ingredient by ID when page loads
  useEffect(() => {
    if (!id) return;

    const fetchIngredient = async () => {
      try {
        const res = await fetch(`/api/ingredients/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch ingredient");

        const data = await res.json();
        // Map API response to form schema
        setInitialValues({
          name: data.data.name,
          unit: data.data.unit,
          calories: data.data.calories || 0,
        });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchIngredient();
  }, [id]);

  // Handle form submission for updating ingredient
  const handleSubmit = async (data: IngredientFormSchema) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update ingredient");
      }

      // Navigate back to ingredient list after successful update
      router.push("/dashboard/ingredients");
    } catch (err: any) {
      console.error(err.message || err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until initialValues are loaded
  if (!initialValues) return <p>Loading ingredient...</p>;

  return (
    <IngredientForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
