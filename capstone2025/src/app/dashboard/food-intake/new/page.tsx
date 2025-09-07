// Path: src/app/dashboard/food-intake/new/page.tsx
"use client";

/**
 * NewFoodIntakePage
 * -----------------
 * Allows users to log a new food intake entry.
 * Features:
 * - Protected route
 * - Select recipe or ingredient
 * - Specify quantity, unit, and meal type
 * - Type-safe form with React Hook Form
 * - POST request to `/api/food-intake`
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodIntake } from "@/types/foodIntake";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";
import styles from "./FoodIntakeFormPage.module.css";

// -----------------------------
// Form type
// -----------------------------
interface FoodIntakeForm {
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  quantity: number;
  unit: string;
  recipeId?: string;
  ingredientId?: string;
}

export default function NewFoodIntakePage() {
  return (
    <ProtectedRoute>
      <FoodIntakeFormContent />
    </ProtectedRoute>
  );
}

function FoodIntakeFormContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FoodIntakeForm>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      mealType: "Breakfast",
      quantity: 1,
      unit: "",
    },
  });

  const selectedRecipe = watch("recipeId");

  // -----------------------------
  // Fetch recipes and ingredients for selection
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const [recipesRes, ingredientsRes] = await Promise.all([
          fetch("/api/recipes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/ingredients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
    }

    fetchData();
  }, [user]);

  // -----------------------------
  // Form submission handler
  // -----------------------------
  const onSubmit: SubmitHandler<FoodIntakeForm> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to log food intake");
      }

      router.push("/dashboard/food-intake");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Log Food Intake</h1>

      {serverError && <p className={styles.error}>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Date */}
        <label>
          Date *
          <input type="date" {...register("date", { required: true })} />
          {errors.date && (
            <span className={styles.error}>Date is required</span>
          )}
        </label>

        {/* Meal Type */}
        <label>
          Meal Type *
          <select {...register("mealType", { required: true })}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </label>

        {/* Recipe or Ingredient */}
        <label>
          Recipe
          <select {...register("recipeId")}>
            <option value="">Select recipe</option>
            {recipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Ingredient
          <select {...register("ingredientId")}>
            <option value="">Select ingredient</option>
            {ingredients.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name}
              </option>
            ))}
          </select>
        </label>

        {/* Quantity & Unit */}
        <label>
          Quantity *
          <input
            type="number"
            step="0.01"
            {...register("quantity", { required: true, min: 0.01 })}
          />
          {errors.quantity && (
            <span className={styles.error}>Quantity required</span>
          )}
        </label>

        <label>
          Unit *
          <input type="text" {...register("unit", { required: true })} />
          {errors.unit && <span className={styles.error}>Unit required</span>}
        </label>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Log Intake"}
        </button>
      </form>
    </main>
  );
}
