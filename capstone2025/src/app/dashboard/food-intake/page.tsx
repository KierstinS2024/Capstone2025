// Path: src/app/dashboard/food-intake/page.tsx
"use client";

/**
 * FoodIntakeDashboardPage
 * ----------------------
 * Shows all food intake entries for the current user.
 * Features:
 * - Protected route
 * - Fetches entries, recipes, ingredients
 * - Allows navigation to create/edit entries
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { FoodIntakeFormType } from "@/schemas/food-intake/foodIntakeForm";
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

  // Fetch entries, recipes, ingredients
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

        // Sort entries newest first
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

  // Helper: map recipe/ingredient IDs to names
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

  // Helper: format ISO date
  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
          {entries.map((entry, index) => (
            <li key={index} className={styles.listItem}>
              <span>
                {formatDate(entry.date)} — {entry.mealType} — {entry.quantity}{" "}
                {entry.unit} — {getItemName(entry.recipeId, entry.ingredientId)}
              </span>

              <button
                className={styles.editButton}
                onClick={() =>
                  router.push(
                    `/dashboard/food-intake/${index}/edit` // replace index with actual _id if available
                  )
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
