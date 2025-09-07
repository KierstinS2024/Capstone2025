// src/app/shopping-lists/[id]/edit/page.tsx

"use client";

/**
 * EditShoppingListPage
 * --------------------
 * Allows users to edit an existing shopping list.
 * Features:
 * - Protected route
 * - Pre-fills form with shopping list data from `/api/shopping-lists/[id]`
 * - Dynamic items list (add/remove)
 * - React Hook Form + TypeScript for type safety
 * - PUT request to `/api/shopping-lists/[id]`
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import styles from "./ShoppingListFormPage.module.css";

// -----------------------------
// Form interface
// -----------------------------
interface ShoppingListForm extends Omit<ShoppingList, "_id" | "userId"> {}

export default function EditShoppingListPage() {
  return (
    <ProtectedRoute>
      <ShoppingListEditForm />
    </ProtectedRoute>
  );
}

function ShoppingListEditForm() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as string;

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, setValue, formState: { errors } } =
    useForm<ShoppingListForm>({
      defaultValues: {
        title: "",
        notes: "",
        items: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // -----------------------------
  // Fetch shopping list to pre-fill form
  // -----------------------------
  useEffect(() => {
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
        setValue("items", list.items || []);
      } catch (err) {
        console.error(err);
        setServerError(err instanceof Error ? err.message : "Unexpected error");
      }
    }
    fetchShoppingList();
  }, [listId, setValue]);

  // -----------------------------
  // Form submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<ShoppingListForm> = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/shopping-lists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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

        {/* Notes field */}
        <label>
          Notes
          <textarea {...register("notes")} />
        </label>

        {/* Items section */}
        <section className={styles.section}>
          <h2>Items</h2>
          {fields.map((field, index) => (
            <div key={field._id ?? index} className={styles.itemRow}>
              <input
                type="text"
                placeholder="Item Name"
                {...register(`items.${index}.name`, { required: true })}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Quantity"
                {...register(`items.${index}.quantity`, {
                  required: true,
                  min: 0.01,
                })}
              />
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
            onClick={() => append({ name: "", quantity: 1, unit: "" })}
          >
            + Add Item
          </button>
        </section>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Saving..." : "Update Shopping List"}
        </button>
      </form>
    </main>
  );
}
