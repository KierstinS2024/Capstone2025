// ===========================================
// PATH: src/components/ShoppingListPanel.tsx
// Shopping List panel component
// Generates today's or week's ingredients based on the active meal plan
// Supports manual add, toggle, remove, and clear actions
// ===========================================
"use client";

import React, { useState } from "react";

// -----------------------------
// Context hooks
// -----------------------------
import { useShoppingList } from "@/context/ShoppingListContext";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";

// -----------------------------
// Import type directly from types file
// -----------------------------
import type { MealType } from "@/types/mealPlan";

// -----------------------------
// Import shopping list item type
// -----------------------------
import type { ShoppingListItem } from "@/types/shoppingList"; // define in types if not already

import styles from "@/styles/shoppingList.module.css";

export default function ShoppingListPanel() {
  // -----------------------------
  // Context state & actions
  // -----------------------------
  const { list, loading, add, addBulk, toggle, remove, clear } =
    useShoppingList();
  const { activePlan } = useMealPlans();
  const { fetchRecipe } = useRecipes();

  // -----------------------------
  // Local state
  // -----------------------------
  const [newItemName, setNewItemName] = useState(""); // for manual add input
  const [isGenerating, setIsGenerating] = useState(false); // for async ingredient generation

  // -----------------------------
  // Extract unique ingredients from recipe IDs
  // -----------------------------
  const extractIngredientsFromRecipes = async (
    recipeIds: string[]
  ): Promise<string[]> => {
    const ingredientSet = new Set<string>();

    for (const recipeId of recipeIds) {
      const recipe = await fetchRecipe(recipeId);
      // Add all ingredients to the set to ensure uniqueness
      recipe?.ingredients?.forEach((ingredient) =>
        ingredientSet.add(ingredient)
      );
    }

    return Array.from(ingredientSet);
  };

  // -----------------------------
  // Generate today's ingredients
  // -----------------------------
  const generateTodayIngredients = async () => {
    if (!activePlan) return;

    setIsGenerating(true);

    const todayISO = new Date().toISOString().split("T")[0];
    const todayMeals = activePlan.meals[todayISO];

    if (!todayMeals) {
      setIsGenerating(false);
      return;
    }

    const recipeIds = Object.values(todayMeals).filter(Boolean) as string[];
    const ingredients = await extractIngredientsFromRecipes(recipeIds);

    if (ingredients.length > 0) await addBulk(ingredients);

    setIsGenerating(false);
  };

  // -----------------------------
  // Generate ingredients for the whole week
  // -----------------------------
  const generateWeekIngredients = async () => {
    if (!activePlan) return;

    setIsGenerating(true);

    const recipeIdsForWeek: string[] = [];

    Object.values(activePlan.meals).forEach((dailyMeals) => {
      (["breakfast", "lunch", "dinner"] as MealType[]).forEach((meal) => {
        const recipeId = dailyMeals[meal];
        if (recipeId) recipeIdsForWeek.push(recipeId);
      });
    });

    const ingredients = await extractIngredientsFromRecipes(recipeIdsForWeek);

    if (ingredients.length > 0) await addBulk(ingredients);

    setIsGenerating(false);
  };

  // -----------------------------
  // Loading guard
  // -----------------------------
  if (loading || isGenerating) return <p>Loading shopping list...</p>;

  // -----------------------------
  // Render panel
  // -----------------------------
  return (
    <div className={styles.panel}>
      <h2>Shopping List</h2>

      {/* Buttons to auto-generate ingredients from active meal plan */}
      {activePlan && (
        <div className={styles.generateButtons}>
          <button onClick={generateTodayIngredients}>
            Generate Today's Ingredients
          </button>
          <button onClick={generateWeekIngredients}>
            Generate Week's Ingredients
          </button>
        </div>
      )}

      {/* Form to manually add a new item */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newItemName.trim()) return;
          await add(newItemName);
          setNewItemName("");
        }}
        className={styles.addForm}
      >
        <input
          type="text"
          value={newItemName}
          placeholder="Add item..."
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* List of shopping items */}
      <ul className={styles.itemList}>
        {list?.items.map((shoppingItem: ShoppingListItem) => (
          // ✅ Ensure each child has a unique `key` prop
          <li key={shoppingItem.id} className={styles.item}>
            <label>
              <input
                type="checkbox"
                checked={shoppingItem.checked}
                onChange={() => toggle(shoppingItem.id)}
              />
              {shoppingItem.name}
            </label>
            <button onClick={() => remove(shoppingItem.id)}>x</button>
          </li>
        ))}
      </ul>

      {/* Clear all button */}
      {list?.items.length ? (
        <button className={styles.clearBtn} onClick={clear}>
          Clear All
        </button>
      ) : null}
    </div>
  );
}
