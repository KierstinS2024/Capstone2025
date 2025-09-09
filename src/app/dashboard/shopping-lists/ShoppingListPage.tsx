// path: src/app/dashboard/shopping-lists/ShoppingListPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useMealPlanContext, MealPlan } from "@/context/MealPlanContext";
import styles from "./ShoppingListsShared.module.css";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface AggregatedIngredient {
  name: string;
  totalQuantity: number;
  unit: string;
}

export default function ShoppingListPage() {
  const { mealPlans } = useMealPlanContext();
  const [ingredients, setIngredients] = useState<AggregatedIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    async function fetchIngredients() {
      try {
        setLoading(true);
        setError(null);

        // Gather all recipe IDs from all meal plans
        const recipeIds: string[] = [];
        mealPlans.forEach((plan: MealPlan) => {
          plan.entries?.forEach((entry) => {
            if (entry.recipeId) recipeIds.push(entry.recipeId);
          });
        });

        // Fetch all recipe details
        const recipesResponses = await Promise.all(
          recipeIds.map((id) =>
            fetch(`/api/recipes/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())
          )
        );

        // Aggregate ingredients
        const allIngredients: AggregatedIngredient[] = [];
        recipesResponses.forEach((data) => {
          if (data.recipe?.ingredients?.length) {
            data.recipe.ingredients.forEach((ing: Ingredient) => {
              const existing = allIngredients.find(
                (i) => i.name === ing.name && i.unit === ing.unit
              );
              if (existing) {
                existing.totalQuantity += ing.quantity;
              } else {
                allIngredients.push({
                  name: ing.name,
                  totalQuantity: ing.quantity,
                  unit: ing.unit,
                });
              }
            });
          }
        });

        setIngredients(allIngredients);
      } catch (err: any) {
        setError(err.message || "Error fetching ingredients");
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, [mealPlans, token]);

  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (ingredients.length === 0)
    return <p className={styles.message}>No ingredients found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping List</h1>
      <ul className={styles.list}>
        {ingredients.map((ing) => (
          <li key={ing.name} className={styles.listItem}>
            {ing.name}: {ing.totalQuantity} {ing.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
