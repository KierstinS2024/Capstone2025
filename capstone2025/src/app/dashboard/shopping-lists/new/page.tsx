"use client";

/**
 * NewShoppingListPage
 * -------------------
 * Allows users to create a new shopping list.
 * Features:
 * - Protected route
 * - React Hook Form + TypeScript
 * - Dynamic list items (add/remove)
 * - Auto-fill name when selecting ingredient
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
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import { IngredientBody } from "@/types/ingredient";
import styles from "./ShoppingListFormPage.module.css";

/**
 * Form type: matches ShoppingList but omits `_id` for form handling
 */
interface ShoppingListForm extends Omit<ShoppingList, "_id"> {}

export default function NewShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingListFormComponent />
    </ProtectedRoute>
  );
}

function ShoppingListFormComponent() {
  const router = useRouter();
  const [allIngredients, setAllIngredients] = useState<IngredientBody[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShoppingListForm>({
    defaultValues: {
      title: "",
      items: [],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // -----------------------------
  // Fetch all ingredients
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
  // Form submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<ShoppingListForm> = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create shopping list");
      }
      router.push("/dashboard/shopping-lists");
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
      <h1 className={styles.title}>New Shopping List</h1>
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

        {/* Notes */}
        <label>
          Notes
          <textarea {...register("notes")} />
        </label>

        {/* Items */}
        <section className={styles.section}>
          <h2>Items</h2>
          {fields.map((field, index) => (
            <div key={field.id ?? index} className={styles.itemRow}>
              {/* Ingredient selector */}
              <Controller
                control={control}
                name={`items.${index}.ingredientId`}
                render={({ field }) => (
                  <select
                    {...field}
                    required
                    onChange={(e) => {
                      const selected = allIngredients.find(
                        (ing) => ing._id === e.target.value
                      );
                      field.onChange(e); // update ingredientId
                      if (selected) {
                        setValue(`items.${index}.name`, selected.name); // auto-fill name
                      }
                    }}
                  >
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
                {...register(`items.${index}.quantity`, {
                  required: true,
                  min: 0.01,
                })}
              />

              {/* Unit */}
              <input
                type="text"
                placeholder="Unit"
                {...register(`items.${index}.unit`)}
              />

              {/* Remove button */}
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}

          {/* Add item */}
          <button
            type="button"
            onClick={() =>
              append({ name: "", ingredientId: "", quantity: 1, unit: "" })
            }
          >
            + Add Item
          </button>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Create Shopping List"}
        </button>
      </form>
    </main>
  );
}
