// path: src/app/dashboard/recipes/new/page.tsx
"use client";

/**
 * NewRecipePage
 * -----------------
 * Page for creating a new user-submitted recipe.
 * - Uses the reusable RecipeForm component
 * - No initial data is provided
 * - Handles redirection after save
 */

import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  /** Handler after successfully saving a recipe */
  const handleRecipeSave = () => {
    router.push("/dashboard/recipes"); // Redirect back to Recipes Dashboard
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px" }}>
        <h1>Add a New Recipe</h1>

        {/* RecipeForm component with no initial data */}
        <RecipeForm onSave={handleRecipeSave} />
      </main>
    </ProtectedRoute>
  );
}
