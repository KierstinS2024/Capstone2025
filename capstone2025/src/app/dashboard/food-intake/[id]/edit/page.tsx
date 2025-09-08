// Path: src/app/dashboard/food-intake/[id]/edit/page.tsx
"use client";

/**
 * EditFoodIntakePage
 * ------------------
 * Path: /dashboard/food-intake/[id]/edit
 * Features:
 * - Protected route (requires login)
 * - Loads existing food intake entry by ID
 * - Uses reusable FoodIntakeForm component
 * - Handles update submission
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodIntakeForm as FoodIntakeFormType } from "@/types/foodIntakeForm";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";
import FoodIntakeForm from "@/components/FoodIntakeForm";

export default function EditFoodIntakePage() {
  return (
    <ProtectedRoute>
      <EditFoodIntakeWrapper />
    </ProtectedRoute>
  );
}

function EditFoodIntakeWrapper() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [initialValues, setInitialValues] = useState<FoodIntakeFormType | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Fetch recipes & ingredients
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
      }
    };

    fetchData();
  }, [user]);

  // Fetch existing entry for editing
  useEffect(() => {
    if (!user || !id) return;

    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/food-intake/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch food intake entry");

        const data = await res.json();
        setInitialValues(data.data); // data.data must match FoodIntakeFormType
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchEntry();
  }, [user, id]);

  // Handle update submission
  const handleSubmit = async (data: FoodIntakeFormType) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/food-intake/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update entry");
      }

      router.push("/dashboard/food-intake");
    } catch (err: any) {
      console.error(err.message || err);
      alert(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) return <p>Loading entry...</p>;

  return (
    <FoodIntakeForm
      initialValues={initialValues}
      recipes={recipes}
      ingredients={ingredients}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
