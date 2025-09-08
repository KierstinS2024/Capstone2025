// Path: src/app/dashboard/ingredients/page.tsx
"use client";

/**
 * IngredientsDashboardPage
 * -----------------------
 * Shows all ingredients for the current user.
 * Features:
 * - Protected route
 * - Fetches ingredients
 * - Allows navigation to create/edit ingredients
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { IngredientBody } from "@/types/ingredient";
import styles from "./IngredientsDashboardPage.module.css";

export default function IngredientsDashboardPage() {
  return (
    <ProtectedRoute>
      <IngredientsList />
    </ProtectedRoute>
  );
}

function IngredientsList() {
  const router = useRouter();
  const { user } = useAuth();

  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ingredients
  useEffect(() => {
    if (!user) return;

    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ingredients", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch ingredients");

        const data = await res.json();
        setIngredients(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [user]);

  if (loading) return <p className={styles.message}>Loading ingredients...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Ingredients</h1>

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/ingredients/new")}
      >
        + Add Ingredient
      </button>

      {ingredients.length === 0 ? (
        <p className={styles.emptyMessage}>No ingredients found.</p>
      ) : (
        <ul className={styles.list}>
          {ingredients.map((ingredient) => (
            <li key={ingredient._id} className={styles.listItem}>
              <span>{ingredient.name}</span>

              <button
                className={styles.editButton}
                onClick={() =>
                  router.push(`/dashboard/ingredients/${ingredient._id}/edit`)
                }
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
