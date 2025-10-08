// ===========================================
// PATH: src/components/RecipeDetail.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import { parseInstructions } from "@/utils/parseInstructions";
import styles from "@/styles/recipeDetail.module.css";

interface Props {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: Props) {
  // -----------------------------
  // Context hooks
  // -----------------------------
  const { user } = useAuth();
  const { add, addBulk } = useShoppingList();
  const { addRecipe, deleteRecipe } = useRecipes();

  // -----------------------------
  // State
  // -----------------------------
  const [addingIngredient, setAddingIngredient] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);

  const isUserRecipe =
    recipe.author === user?.email && recipe.source !== "spoonacular";

  // -----------------------------
  // Add single ingredient
  // -----------------------------
  const handleAddIngredient = async (ingredient: string) => {
    setAddingIngredient(ingredient);
    try {
      await add(ingredient);
    } catch {
      alert("Failed to add ingredient");
    } finally {
      setAddingIngredient(null);
    }
  };

  // -----------------------------
  // Add all ingredients
  // -----------------------------
  const handleAddAll = async () => {
    if (!recipe.ingredients?.length) return;
    setAddingAll(true);
    try {
      await addBulk(recipe.ingredients);
    } catch {
      alert("Failed to add ingredients");
    } finally {
      setAddingAll(false);
    }
  };

  // -----------------------------
  // Save Spoonacular recipe
  // -----------------------------
  const handleSaveRecipe = async () => {
    if (recipe.source !== "spoonacular" || !user?.email) return;

    setSavingRecipe(true);
    try {
      await addRecipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image: recipe.image,
        source: "spoonacular",
        author: user.email,
      });
      setRecipeSaved(true);
      alert("Recipe saved!");
    } catch {
      alert("Failed to save recipe");
    } finally {
      setSavingRecipe(false);
    }
  };

  // -----------------------------
  // Delete user recipe
  // -----------------------------
  const handleDeleteRecipe = async () => {
    if (!isUserRecipe) return;

    try {
      await deleteRecipe(recipe.id);
      alert("Recipe deleted!");
    } catch {
      alert("Failed to delete recipe");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles.container}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {isUserRecipe && <button onClick={handleDeleteRecipe}>Delete</button>}
        {recipe.source === "spoonacular" && !recipeSaved && (
          <button onClick={handleSaveRecipe} disabled={savingRecipe}>
            {savingRecipe ? "Saving..." : "Save to My Recipes"}
          </button>
        )}
      </div>

      <h2 className={styles.title}>{recipe.title}</h2>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className={styles.image} />
      )}

      <h3>Ingredients</h3>
      <ul className={styles.ingredients}>
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx} className={styles.ingredientItem}>
            <button
              className={styles.addBtn}
              disabled={addingIngredient === ing}
              onClick={() => handleAddIngredient(ing)}
            >
              {addingIngredient === ing ? "Adding..." : "+"}
            </button>
            {ing}
          </li>
        ))}
      </ul>
      <button
        className={styles.addAllBtn}
        disabled={addingAll}
        onClick={handleAddAll}
      >
        {addingAll ? "Adding All..." : "Add All to Shopping List"}
      </button>

      <h3>Instructions</h3>
      <div className={styles.instructions}>
        {parseInstructions(recipe.instructions)}
      </div>
    </div>
  );
}
