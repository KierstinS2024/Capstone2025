// path: src/app/dashboard/recipes/[id]/edit/page.tsx
"use client";

/**
 * EditRecipePage
 * ----------------
 * Allows a user to edit one of their own recipes.
 * - Fetches the recipe by ID
 * - Prefills RecipeForm with initialData
 * - Prevents editing if recipe is not user-submitted
 * - Redirects unauthenticated users to login
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import RecipeForm from "@/components/RecipeForm";
import { useAuth } from "@/context/AuthContext";

// Ingredient shape used in recipes
interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

// Full recipe shape returned by API
interface UserRecipe {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cuisine: string;
  userSubmitted: boolean; // only user-submitted recipes are editable
}

export default function EditRecipePage() {
  const params = useParams();
  const { id } = params; // recipe ID from URL
  const { token } = useAuth(); // JWT from AuthContext
  const router = useRouter();

  // --- Local state ---
  const [recipeData, setRecipeData] = useState<UserRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect immediately if user is not logged in
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch recipe by ID and ensure it is user-submitted
  useEffect(() => {
    if (!id || !token) return;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: UserRecipe = await res.json();

        if (!res.ok || !data) {
          setError("Recipe not found or you do not have access.");
          return;
        }

        if (!data.userSubmitted) {
          setError(
            "This recipe cannot be edited because it is not user-submitted."
          );
          return;
        }

        setRecipeData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  // --- Loading & error states ---
  if (loading) return <p>Loading recipe...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => router.push("/dashboard/recipes")}>
          Go Back
        </button>
      </div>
    );
  if (!recipeData) return null; // safety fallback

  // --- Render RecipeForm with prefilled data ---
  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "1rem" }}>
        <h1>Edit Recipe</h1>
        <RecipeForm
          initialData={{
            _id: recipeData._id,
            name: recipeData.name,
            description: recipeData.description,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            cuisine: recipeData.cuisine,
          }}
          onSave={() => router.push("/dashboard/recipes")} // redirect after save
        />
      </div>
    </ProtectedRoute>
  );
}
