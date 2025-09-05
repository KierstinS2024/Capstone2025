// path: src/app/ingredients/new/page.tsx
"use client";

/**
 * NewIngredientPage
 * -----------------
 * Dashboard page to add a new ingredient.
 * Uses IngredientForm with no initial data.
 */

import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import IngredientForm from "@/components/IngredientsForm";
import { useRouter } from "next/navigation";

export default function NewIngredientPage() {
  const router = useRouter();

  const handleSave = () => {
    router.push("/ingredients"); // redirect after save
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Add New Ingredient</h1>
        <IngredientForm onSave={handleSave} />
      </main>
    </ProtectedRoute>
  );
}
