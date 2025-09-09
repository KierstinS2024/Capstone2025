// src/app/dashboard/recipes/new/page.tsx
"use client";

// --- React & Next imports ---
import { useRouter } from "next/navigation";

// --- Component imports ---
import ProtectedRoute from "@/components/ProtectedRoute"; // ensures only authenticated users can access
import NavBar from "@/components/NavBar"; // dashboard navigation
import RecipeForm from "@/components/RecipeForm"; // reusable recipe form

export default function NewRecipePage() {
  const router = useRouter();

  // --- Callback after saving a new recipe ---
  const handleRecipeSave = () => {
    router.push("/dashboard/recipes"); // redirect to recipes dashboard
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Add a New Recipe</h1>

        {/* RecipeForm with no initial data for creating a new recipe */}
        <RecipeForm onSave={handleRecipeSave} />
      </main>
    </ProtectedRoute>
  );
}
