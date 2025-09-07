// Path: src/app/dashboard/ingredients/[id]/edit/page.tsx
"use client";

/**
 * EditIngredientPage
 * -----------------
 * Allows users to edit an existing ingredient.
 * Features:
 * - Protected route
 * - Fetch ingredient data by ID and pre-fill form
 * - React Hook Form for state + validation
 * - Type-safe using IngredientBody
 * - API PUT to /api/ingredients/[id]
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import ProtectedRoute from "@/components/ProtectedRoute";
import { IngredientBody } from "@/types/ingredient";
import styles from "./IngredientFormPage.module.css";

export default function EditIngredientPage() {
  return (
    <ProtectedRoute>
      <IngredientEditForm />
    </ProtectedRoute>
  );
}

function IngredientEditForm() {
  const router = useRouter();
  const params = useParams();
  const ingredientId = params.id;

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IngredientBody>();

  // -----------------------------
  // Fetch existing ingredient
  // -----------------------------
  useEffect(() => {
    if (!ingredientId) return;

    async function fetchIngredient() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/ingredients/${ingredientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch ingredient");

        const data = await res.json();
        const ingredient: IngredientBody = data.data;

        setValue("name", ingredient.name);
        setValue("unit", ingredient.unit);
        setValue("defaultQuantity", ingredient.defaultQuantity);
        setValue("nutritionInfo", ingredient.nutritionInfo || {});
      } catch (err) {
        console.error(err);
        setServerError(err instanceof Error ? err.message : "Unexpected error");
      }
    }

    fetchIngredient();
  }, [ingredientId, setValue]);

  // -----------------------------
  // Form submission handler
  // -----------------------------
  const onSubmit: SubmitHandler<IngredientBody> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/ingredients/${ingredientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update ingredient");
      }

      router.push("/dashboard/ingredients"); // Redirect after edit
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
      <h1 className={styles.title}>Edit Ingredient</h1>

      {serverError && <p className={styles.error}>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>
          Name *
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </label>

        <label>
          Unit *
          <input
            type="text"
            {...register("unit", { required: "Unit is required" })}
          />
          {errors.unit && (
            <span className={styles.error}>{errors.unit.message}</span>
          )}
        </label>

        <label>
          Default Quantity *
          <input
            type="number"
            step="0.01"
            {...register("defaultQuantity", {
              required: "Default quantity is required",
              min: { value: 0.01, message: "Must be greater than 0" },
            })}
          />
          {errors.defaultQuantity && (
            <span className={styles.error}>
              {errors.defaultQuantity.message}
            </span>
          )}
        </label>

        <label>
          Nutrition Info (JSON, optional)
          <textarea {...register("nutritionInfo")}></textarea>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Update Ingredient"}
        </button>
      </form>
    </main>
  );
}
