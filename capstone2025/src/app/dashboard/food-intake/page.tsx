// Path: src/app/dashboard/food-intake/page.tsx
"use client";

/**
 * FoodIntakeDashboardPage
 * ------------------------
 * Path: /dashboard/food-intake
 *
 * Features:
 * - Protected route (requires login)
 * - Fetches food intake entries, recipes, and ingredients
 * - Displays a list of intake entries (sorted newest → oldest)
 * - Provides navigation to create, edit, and delete entries
 * - Prevents deletion of Spoonacular-based recipes (read-only)
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodIntakeForm as FoodIntakeFormType } from "@/types/foodIntakeForm";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";

import styles from "./FoodIntakeListPage.module.css";

interface FoodIntakeResponse {
  success: boolean;
  data: FoodIntakeFormType[];
  message?: string;
}

export default function FoodIntakeDashboardPage() {
  return (
    <ProtectedRoute>
      <FoodIntakeList />
    </ProtectedRoute>
  );
}

function FoodIntakeList() {
  const router = useRouter();
  const { user } = useAuth();

  const [entries, setEntries] = useState<FoodIntakeFormType[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<IngredientBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch intake entries, recipes, and ingredients
   */
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [entriesRes, recipesRes, ingredientsRes] = await Promise.all([
          fetch("/api/food-intake", { credentials: "include" }),
          fetch("/api/recipes", { credentials: "include" }),
          fetch("/api/ingredients", { credentials: "include" }),
        ]);

        if (!entriesRes.ok)
          throw new Error("Failed to fetch food intake entries");
        if (!recipesRes.ok) throw new Error("Failed to fetch recipes");
        if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");

        const entriesData: FoodIntakeResponse = await entriesRes.json();
        const recipesData = await recipesRes.json();
        const ingredientsData = await ingredientsRes.json();

        const sortedEntries = (entriesData.data || []).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setEntries(sortedEntries);
        setRecipes(recipesData.data || []);
        setIngredients(ingredientsData.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p className={styles.message}>Loading food intake...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  /**
   * Helpers
   */
  const getItemName = (recipeId?: string, ingredientId?: string) => {
    if (recipeId) {
      const recipe = recipes.find((r) => r._id === recipeId);
      return recipe ? recipe.title : recipeId;
    }
    if (ingredientId) {
      const ingredient = ingredients.find((i) => i._id === ingredientId);
      return ingredient ? ingredient.name : ingredientId;
    }
    return "—";
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /**
   * Delete intake entry (user-created only)
   */
  const handleDelete = async (id: string, recipeId?: string) => {
    // Prevent deleting Spoonacular-based recipes
    const recipe = recipeId ? recipes.find((r) => r._id === recipeId) : null;
    if (recipe && recipe.source === "spoonacular") {
      alert("Spoonacular recipes are read-only and cannot be deleted.");
      return;
    }

    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/food-intake/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete entry");
      }

      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  /**
   * Render
   */
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Food Intake</h1>

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/food-intake/new")}
      >
        + Log New Intake
      </button>

      {entries.length === 0 ? (
        <p className={styles.emptyMessage}>No food intake entries found.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry._id} className={styles.listItem}>
              <span>
                {formatDate(entry.date)} — {entry.mealType} — {entry.quantity}{" "}
                {entry.unit} — {getItemName(entry.recipeId, entry.ingredientId)}
              </span>

              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() =>
                    router.push(`/dashboard/food-intake/${entry._id}/edit`)
                  }
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(entry._id!, entry.recipeId)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
