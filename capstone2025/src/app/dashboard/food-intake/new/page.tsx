// Path: src/app/dashboard/food-intake/new/page.tsx
"use client";

/**
 * NewFoodIntakePage
 * -----------------
 * Page to log a new food intake entry.
 * Features:
 * - Protected route (requires login)
 * - Uses reusable FoodIntakeForm component
 * - Fetches recipes & ingredients for dropdowns
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import FoodIntakeForm from "@/components/FoodIntakeForm";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";
import {
  type FoodIntakeFormType,
  foodIntakeFormSchema,
} from "@/schemas/food-intake/foodIntakeForm";

export default function NewFoodIntakePage() {
  return (
    <ProtectedRoute>
      <FoodIntakeFormWrapper />
    </ProtectedRoute>
  );
}

function FoodIntakeFormWrapper() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch recipes & ingredients for dropdowns
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [recipesRes, ingredientsRes] = await Promise.all([
          fetch("/api/recipes", { credentials: "include" }),
          fetch("/api/ingredients", { credentials: "include" }),
        ]);

        if (!recipesRes.ok) throw new Error("Failed to fetch recipes");
        if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");

        const recipesData = await recipesRes.json();
        const ingredientsData = await ingredientsRes.json();

        setRecipes(recipesData.data || []);
        setIngredients(ingredientsData.data || []);
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchData();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (data: FoodIntakeFormType) => {
    setLoading(true);
    try {
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to log food intake");
      }

      router.push("/dashboard/food-intake"); // redirect after success
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FoodIntakeForm
      recipes={recipes}
      ingredients={ingredients}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
