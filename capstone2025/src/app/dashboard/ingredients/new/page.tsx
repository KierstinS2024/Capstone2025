// Path: src/app/dashboard/ingredients/new/page.tsx
"use client";

/**
 * NewIngredientPage
 * -----------------
 * Allows users to add a new ingredient.
 * Features:
 * - Protected route
 * - React Hook Form for state + validation
 * - Type-safe using IngredientBody
 * - API POST to /api/ingredients
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import ProtectedRoute from "@/components/ProtectedRoute";
import { IngredientBody } from "@/types/ingredient";
import styles from "./IngredientFormPage.module.css";

export default function NewIngredientPage() {
  return (
    <ProtectedRoute>
      <IngredientForm />
    </ProtectedRoute>
  );
}

function IngredientForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // React Hook Form setup
  // -----------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientBody>();

  // -----------------------------
  // Form submission handler
  // -----------------------------
  const onSubmit: SubmitHandler<IngredientBody> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create ingredient");
      }

      router.push("/dashboard/ingredients"); // Redirect to ingredients list
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
      <h1 className={styles.title}>Add New Ingredient</h1>

      {serverError && <p className={styles.error}>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Name */}
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

        {/* Unit */}
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

        {/* Default Quantity */}
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

        {/* Nutrition Info (optional JSON) */}
        <label>
          Nutrition Info (JSON, optional)
          <textarea {...register("nutritionInfo")}></textarea>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Add Ingredient"}
        </button>
      </form>
    </main>
  );
}
