"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import IngredientsForm from "@/components/IngredientsForm";
import { useRouter } from "next/navigation";

export default function NewIngredientPage() {
  const router = useRouter();

  const handleSave = () => {
    router.push("/dashboard/ingredients"); // redirect back to list
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Add New Ingredient</h1>
        <IngredientsForm onSave={handleSave} />
      </main>
    </ProtectedRoute>
  );
}
