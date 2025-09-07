// Path: src/app/dashboard/recipes/[id]/edit/page.tsx

"use client";

/**
 * EditRecipePage
 * -----------------
 * Allows users to edit an existing recipe.
 * Features:
 * - Protected route
 * - Pre-fills form with recipe data fetched from `/api/recipes/[id]`
 * - Add/remove ingredients dynamically
 * - React Hook Form + TypeScript for type safety
 * - PUT request to `/api/recipes/[id]`
 * - Normalizes steps (textarea → string[])
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Controller,
} from "react-hook-form";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";
import styles from "./RecipeFormPage.module.css";

// -----------------------------
// Form interface
// -----------------------------
interface RecipeForm extends Omit<Recipe, "_id"> {}

export default function EditRecipePage() {
  return (
    <ProtectedRoute>
      <RecipeEditForm />
    </ProtectedRoute>
  );
}

function RecipeEditForm() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allIngredients, setAllIngredients] = useState<IngredientBody[]>([]);

  // -----------------------------
  // React Hook Form setup
  // -----------------------------
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: {
      title: "",
      description: "",
      servings: 1,
      ingredients: [],
      steps: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // -----------------------------
  // Fetch existing recipe + all ingredients
  // -----------------------------
  useEffect(() => {
    if (!recipeId) return;

    async function fetchRecipe() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const data = await res.json();
        const recipe: Recipe = data.data;

        setValue("title", recipe.title);
        setValue("description", recipe.description || "");
        setValue("servings", recipe.servings);
        setValue("ingredients", recipe.ingredients || []);
        setValue("steps", recipe.steps || []);
      } catch (err) {
        console.error(err);
        setServerError(err instanceof Error ? err.message : "Unexpected error");
      }
    }

    async function fetchIngredients() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/ingredients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        const data = await res.json();
        setAllIngredients(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRecipe();
    fetchIngredients();
  }, [recipeId, setValue]);

  // -----------------------------
  // Submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      // Normalize steps: textarea string → string[]
      const normalizedData = {
        ...data,
        steps: Array.isArray(data.steps)
          ? data.steps
          : String(data.steps)
              .split("\n")
              .map((s) => s.trim())
              .filter((s) => s !== ""),
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalizedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update recipe");
      }

      router.push("/dashboard/recipes");
    } catch (err) {
      console.error(err);
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
      <h1 className={styles.title}>Edit Recipe</h1>
      {serverError && <p className={styles.error}>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Title field */}
        <label>
          Title *
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span className={styles.error}>{String(errors.title.message)}</span>
          )}
        </label>

        {/* Description field */}
        <label>
          Description
          <textarea {...register("description")} />
        </label>

        {/* Servings field */}
        <label>
          Servings *
          <input
            type="number"
            {...register("servings", {
              required: "Servings required",
              min: { value: 1, message: "Must be at least 1" },
            })}
          />
          {errors.servings && (
            <span className={styles.error}>
              {String(errors.servings.message)}
            </span>
          )}
        </label>

        {/* Ingredients section */}
        <section className={styles.section}>
          <h2>Ingredients</h2>
          {fields.map((field, index) => (
            <div key={field.id ?? index} className={styles.ingredientRow}>
              {/* Ingredient selector */}
              <Controller
                control={control}
                name={`ingredients.${index}.ingredientId`}
                render={({ field: selectField }) => (
                  <select {...selectField} required>
                    <option value="">Select ingredient</option>
                    {allIngredients.map((ing) => (
                      <option key={ing._id} value={ing._id}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                )}
              />

              {/* Quantity */}
              <input
                type="number"
                step="0.01"
                placeholder="Quantity"
                {...register(`ingredients.${index}.quantity`, {
                  required: true,
                  min: 0.01,
                })}
              />

              {/* Unit */}
              <input
                type="text"
                placeholder="Unit"
                {...register(`ingredients.${index}.unit`, { required: true })}
              />

              {/* Remove button */}
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ ingredientId: "", quantity: 1, unit: "" })}
          >
            + Add Ingredient
          </button>
        </section>

        {/* Steps section */}
        <section className={styles.section}>
          <h2>Steps</h2>
          <textarea
            placeholder="Enter one step per line"
            {...register("steps")}
          />
        </section>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Update Recipe"}
        </button>
      </form>
    </main>
  );
}
