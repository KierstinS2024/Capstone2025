// Path: src/app/dashboard/ingredients/page.tsx
"use client";

/**
 * Ingredients Page
 * ----------------
 * Public: /dashboard/ingredients
 * Features:
 * - Protected route (requires login)
 * - Fetches all ingredients for the current user
 * - Displays list with edit buttons
 * - Loading & error handling
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { IngredientBody } from "@/types/ingredient";
import styles from "./IngredientsPage.module.css";

// API response type
interface IngredientsResponse {
  success: boolean;
  data: IngredientBody[];
  message?: string;
}

// -----------------------------
// Main page wrapper with protection
// -----------------------------
export default function IngredientsPage() {
  return (
    <ProtectedRoute>
      <IngredientsList />
    </ProtectedRoute>
  );
}

// -----------------------------
// Ingredients list component
// -----------------------------
function IngredientsList() {
  const router = useRouter();
  const { user } = useAuth();

  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ingredients when user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ingredients", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch ingredients");

        const data: IngredientsResponse = await res.json();
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

  // Show loading or error messages
  if (loading) return <p className={styles.message}>Loading ingredients...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Ingredients</h1>

      {/* Button to add a new ingredient */}
      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/ingredients/new")}
      >
        + Add Ingredient
      </button>

      {/* Empty state */}
      {ingredients.length === 0 ? (
        <p className={styles.emptyMessage}>No ingredients found.</p>
      ) : (
        // List of ingredients
        <ul className={styles.list}>
          {ingredients.map((ingredient) => (
            <li key={ingredient._id} className={styles.listItem}>
              <span>
                {ingredient.name} ({ingredient.defaultQuantity}{" "}
                {ingredient.unit})
              </span>
              {/* Edit button */}
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
