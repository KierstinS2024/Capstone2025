// Path: src/app/dashboard/recipes/new/page.tsx

"use client";

/**
 * NewRecipePage
 * -----------------
 * Allows users to create a new recipe.
 * Features:
 * - Protected route
 * - React Hook Form + TypeScript
 * - Dynamic ingredients list (add/remove)
 * - Validation: title required, servings ≥ 1, ingredient quantity ≥ 0.01
 * - Normalizes steps (textarea → string[])
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function NewRecipePage() {
  return (
    <ProtectedRoute>
      <RecipeCreateForm />
    </ProtectedRoute>
  );
}

function RecipeCreateForm() {
  const router = useRouter();
  const [allIngredients, setAllIngredients] = useState<IngredientBody[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // React Hook Form setup
  // -----------------------------
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeForm>({
    defaultValues: {
      title: "",
      description: "",
      servings: 1,
      ingredients: [],
      steps: [], // handled as textarea, normalized on submit
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // -----------------------------
  // Fetch available ingredients
  // -----------------------------
  useEffect(() => {
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
    fetchIngredients();
  }, []);

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
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalizedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create recipe");
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
      <h1 className={styles.title}>New Recipe</h1>
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
          {loading ? "Saving..." : "Create Recipe"}
        </button>
      </form>
    </main>
  );
}
