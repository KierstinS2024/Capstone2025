// src/app/recipes/[id]/edit/page.tsx
"use client";

/**
 * EditRecipePage
 * ----------------
 * - Fetches a recipe by ID
 * - Prefills RecipeForm with initialData
 * - Redirects to recipes dashboard after save
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar"; // fixed import
import RecipeForm, { Recipe as RecipeFormType } from "@/components/RecipeForm";
import { useAuth } from "@/context/AuthContext";

// API ingredient type
interface Ingredient {
  name: string;
  quantity: string | number;
  unit: string;
  ingredientId?: string;
}

// API recipe type
interface UserRecipe {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  userSubmitted: boolean; // only user-submitted recipes can be edited
}

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [recipeData, setRecipeData] = useState<UserRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch recipe by ID
  useEffect(() => {
    if (!id || !token) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

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

  // Loading & error states
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
  if (!recipeData) return null;

  // Map API recipe to RecipeForm type (required `source` field added)
  const initialData: RecipeFormType = {
    _id: recipeData._id,
    name: recipeData.name,
    description: recipeData.description,
    cuisine: recipeData.cuisine,
    ingredients: recipeData.ingredients.map((ing) => ({
      ingredientId: ing.ingredientId || "",
      name: ing.name,
      quantity: Number(ing.quantity) || 1,
      unit: ing.unit,
    })),
    instructions: recipeData.instructions,
    source: "user", // required for RecipeForm
  };

  const handleSave = () => {
    router.push("/dashboard/recipes"); // redirect after save
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "1rem" }}>
        <h1>Edit Recipe</h1>
        <RecipeForm initialData={initialData} onSave={handleSave} />
      </div>
    </ProtectedRoute>
  );
}
