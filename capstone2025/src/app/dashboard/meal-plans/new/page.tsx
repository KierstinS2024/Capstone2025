// Path: src/app/dashboard/meal-plans/new/page.tsx
"use client";

/**
 * NewMealPlanPage
 * -----------------
 * Allows users to create a new meal plan.
 * Features:
 * - Protected route
 * - Dynamic entries (recipe + servings)
 * - React Hook Form + TypeScript for type safety
 * - Validation: title required, servings ≥ 1
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import { Recipe } from "@/types/recipe";
import styles from "./MealPlanFormPage.module.css";

interface MealPlanForm extends Omit<MealPlan, "_id"> {}

export default function NewMealPlanPage() {
  return (
    <ProtectedRoute>
      <MealPlanFormComponent />
    </ProtectedRoute>
  );
}

function MealPlanFormComponent() {
  const router = useRouter();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MealPlanForm>({
    defaultValues: {
      title: "",
      entries: [],
      weekStartDate: undefined,
      userId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  // Fetch all recipes for dropdown
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setAllRecipes(data.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRecipes();
  }, []);

  const onSubmit: SubmitHandler<MealPlanForm> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create meal plan");
      }
      router.push("/dashboard/meal-plans");
    } catch (err) {
      console.error(err);
      setServerError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>New Meal Plan</h1>
      {serverError && <p className={styles.error}>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Title */}
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

        {/* Week Start Date */}
        <label>
          Week Start Date
          <input type="date" {...register("weekStartDate")} />
        </label>

        {/* Entries */}
        <section className={styles.section}>
          <h2>Entries</h2>
          {fields.map((field, index) => (
            <div key={field.id ?? index} className={styles.entryRow}>
              {/* Recipe Selector */}
              <Controller
                control={control}
                name={`entries.${index}.recipeId`}
                render={({ field }) => (
                  <select {...field} required>
                    <option value="">Select recipe</option>
                    {allRecipes.map((recipe) => (
                      <option key={recipe._id} value={recipe._id}>
                        {recipe.title}
                      </option>
                    ))}
                  </select>
                )}
              />

              {/* Servings */}
              <input
                type="number"
                placeholder="Servings"
                {...register(`entries.${index}.servings`, {
                  required: true,
                  min: 1,
                })}
              />

              {/* Remove button */}
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ recipeId: "", servings: 1 })}
          >
            + Add Entry
          </button>
        </section>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Create Meal Plan"}
        </button>
      </form>
    </main>
  );
}
