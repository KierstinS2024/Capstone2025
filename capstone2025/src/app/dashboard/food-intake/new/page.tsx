// File: src/app/dashboard/food-intake/new/page.tsx
"use client";

/**
 * Add Food Entry Page
 * ------------------------
 * Features:
 * - Protected route (JWT + AuthContext)
 * - Form to add a new food entry
 * - Fields: ingredient, quantity, unit, meal type, date
 * - Validation & error handling
 * - Submits to /api/food-intake
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodEntry } from "@/types/foodIntake";
import styles from "./FoodIntakeForm.module.css";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

export default function AddFoodEntryPage() {
  return (
    <ProtectedRoute>
      <FoodEntryForm />
    </ProtectedRoute>
  );
}

function FoodEntryForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<Partial<FoodEntry>>({
    ingredientId: "",
    quantity: 0,
    unit: "",
    mealType: "breakfast",
    date: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? parseFloat(value)
          : name === "date"
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/food-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add entry");

      router.push("/dashboard/food-intake");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Add Food Entry</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Ingredient ID:
          <input
            type="text"
            name="ingredientId"
            value={form.ingredientId || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity:
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={form.quantity || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Unit:
          <input
            type="text"
            name="unit"
            value={form.unit || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Meal Type:
          <select
            name="mealType"
            value={form.mealType || "breakfast"}
            onChange={handleChange}
          >
            {mealTypes.map((meal) => (
              <option key={meal} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={
              form.date ? new Date(form.date).toISOString().substring(0, 10) : ""
            }
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "+ Add Entry"}
        </button>
      </form>
    </main>
  );
}
