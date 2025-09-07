// Path: src/app/dashboard/shopping-lists/[id]/edit/page.tsx
"use client";

/**
 * EditShoppingListPage
 * -------------------
 * Allows users to edit an existing shopping list.
 * Features:
 * - Protected route
 * - Pre-fills form from `/api/shopping-lists/[id]`
 * - Dynamic items (add/remove)
 * - Type-safe with React Hook Form + TypeScript
 * - Validation (required fields, quantity ≥ 0.01)
 * - PUT request to `/api/shopping-lists/[id]`
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
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import { IngredientBody } from "@/types/ingredient";
import styles from "./ShoppingListFormPage.module.css";

// -----------------------------
// Form types
// -----------------------------
interface ShoppingListFormItem {
  _id?: string; // optional for new items
  ingredientId: string; // always string for select
  name: string; // auto-filled from ingredient
  quantity: number;
  unit?: string;
}

interface ShoppingListForm {
  title: string;
  notes?: string;
  items: ShoppingListFormItem[];
  userId: string;
}

// -----------------------------
// Component
// -----------------------------
export default function EditShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingListFormComponent />
    </ProtectedRoute>
  );
}

function ShoppingListFormComponent() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as string;

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
      notes: "",
      items: [],
      userId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // -----------------------------
  // Fetch shopping list + ingredients
  // -----------------------------
  useEffect(() => {
    if (!listId) return;

    async function fetchShoppingList() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/shopping-lists/${listId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch shopping list");

        const data = await res.json();
        const list: ShoppingList = data.data;

        setValue("title", list.title);
        setValue("notes", list.notes || "");
        setValue("userId", list.userId);
        setValue(
          "items",
          list.items?.map((item) => ({
            _id: item._id,
            ingredientId: item.ingredientId || "",
            name: item.name,
            quantity: item.quantity,
            unit: item.unit || "",
          })) || []
        );
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

    fetchShoppingList();
    fetchIngredients();
  }, [listId, setValue]);

  // -----------------------------
  // Submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<ShoppingListForm> = async (data) => {
    setLoading(true);
    setServerError(null);

    try {
      const payload: ShoppingList = {
        _id: listId,
        title: data.title,
        notes: data.notes,
        userId: data.userId,
        items: data.items.map((item) => ({
          _id: item._id || "",
          ingredientId: item.ingredientId,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })),
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/shopping-lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update shopping list");
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
      <h1 className={styles.title}>Edit Shopping List</h1>
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
            <div key={field.id} className={styles.itemRow}>
              {/* Ingredient select */}
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
                      field.onChange(e);
                      if (selected)
                        setValue(`items.${index}.name`, selected.name);
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
                placeholder="Quantity"
                step="0.01"
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

              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ ingredientId: "", name: "", quantity: 1, unit: "" })
            }
          >
            + Add Item
          </button>
        </section>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Saving..." : "Update Shopping List"}
        </button>
      </form>
    </main>
  );
}
