// Path: src/app/dashboard/ingredients/new/page.tsx
"use client";

/**
 * NewIngredientPage
 * -----------------
 * Page for adding a new ingredient.
 * Features:
 * - Protected route
 * - Uses IngredientForm
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import IngredientForm, {
  IngredientFormSchema,
} from "@/components/IngredientForm";

export default function NewIngredientPage() {
  return (
    <ProtectedRoute>
      <NewIngredientFormWrapper />
    </ProtectedRoute>
  );
}

function NewIngredientFormWrapper() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: IngredientFormSchema) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create ingredient");
      }
      router.push("/dashboard/ingredients");
    } catch (err: any) {
      console.error(err.message || err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return <IngredientForm onSubmit={handleSubmit} loading={loading} />;
}
