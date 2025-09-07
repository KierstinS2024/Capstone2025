// Path: src/app/dashboard/meal-plans/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MealPlan } from "@/types/mealPlan";
import { Recipe } from "@/types/recipe";
import styles from "./MealPlanFormPage.module.css";

// -----------------------------
// Form types
// -----------------------------
interface MealPlanFormEntry {
  _id?: string; // optional for new entries
  recipeId: string; // always string for select
  servings: number;
}

interface MealPlanForm {
  title: string;
  userId: string;
  notes?: string;
  weekStartDate?: string; // string for <input type="date">
  entries: MealPlanFormEntry[];
}

// -----------------------------
// Component
// -----------------------------
export default function EditMealPlanPage() {
  return (
    <ProtectedRoute>
      <MealPlanFormComponent />
    </ProtectedRoute>
  );
}

function MealPlanFormComponent() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MealPlanForm>({
    defaultValues: {
      title: "",
      userId: "",
      notes: "",
      weekStartDate: "",
      entries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  // -----------------------------
  // Fetch meal plan + recipes
  // -----------------------------
  useEffect(() => {
    if (!planId) return;

    async function fetchMealPlan() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch meal plan");

        const data = await res.json();
        const plan: MealPlan = data.data;

        // Set form values
        setValue("title", plan.title);
        setValue(
          "weekStartDate",
          plan.weekStartDate
            ? new Date(plan.weekStartDate).toISOString().split("T")[0]
            : ""
        );
        setValue("userId", plan.userId);
        setValue("notes", plan.notes || "");
        setValue(
          "entries",
          plan.entries.map((e) => ({
            _id: e._id,
            recipeId:
              typeof e.recipeId === "string" ? e.recipeId : e.recipeId._id,
            servings: e.servings,
          }))
        );
      } catch (err) {
        console.error(err);
        setServerError(err instanceof Error ? err.message : "Unexpected error");
      }
    }

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

    fetchMealPlan();
    fetchRecipes();
  }, [planId, setValue]);

  // -----------------------------
  // Submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<MealPlanForm> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const payload: MealPlan = {
        _id: planId,
        title: data.title,
        userId: data.userId,
        notes: data.notes,
        weekStartDate: data.weekStartDate
          ? new Date(data.weekStartDate)
          : undefined,
        entries: data.entries.map((e) => ({
          _id: e._id || "", // empty string for new entries
          recipeId: e.recipeId,
          servings: e.servings,
        })),
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update meal plan");
      }

      router.push("/dashboard/meal-plans");
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
      <h1 className={styles.title}>Edit Meal Plan</h1>
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

        {/* Notes */}
        <label>
          Notes
          <textarea {...register("notes")} />
        </label>

        {/* Entries */}
        <section className={styles.section}>
          <h2>Entries</h2>
          {fields.map((field, index) => (
            <div key={field.id} className={styles.entryRow}>
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
              <input
                type="number"
                placeholder="Servings"
                {...register(`entries.${index}.servings`, {
                  required: true,
                  min: 1,
                })}
              />
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
          {loading ? "Saving..." : "Update Meal Plan"}
        </button>
      </form>
    </main>
  );
}
