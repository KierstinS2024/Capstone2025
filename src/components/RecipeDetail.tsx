// PATH: src/components/RecipeDetail.tsx
"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes } from "@/context/RecipeContext";
import { parseInstructions } from "@/utils/parseInstructions";
import styles from "@/styles/recipeDetail.module.css";

interface Props {
  recipe: Recipe; // Recipe to display
}

export default function RecipeDetail({ recipe }: Props) {
  const { add, addBulk } = useShoppingList(); // shopping list context
  const { addRecipe, deleteRecipe } = useRecipes(); // recipe context

  const [addingIngredient, setAddingIngredient] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);

  // Current user email
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // Check if recipe belongs to current user
  const isUserRecipe =
    recipe.source !== "spoonacular" && recipe.author === userEmail;

  // -----------------------------
  // Add single ingredient to shopping list
  // -----------------------------
  const handleAddIngredient = async (ingredient: string) => {
    setAddingIngredient(ingredient);
    try {
      await add(ingredient);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
      alert("Failed to add ingredient");
    } finally {
      setAddingIngredient(null);
    }
  };

  // -----------------------------
  // Add all ingredients to shopping list
  // -----------------------------
  const handleAddAll = async () => {
    if (!recipe.ingredients?.length) return;
    setAddingAll(true);
    try {
      await addBulk(recipe.ingredients);
    } catch (err) {
      console.error("Failed to add all ingredients:", err);
      alert("Failed to add ingredients");
    } finally {
      setAddingAll(false);
    }
  };

  // -----------------------------
  // Save Spoonacular recipe to user's recipes
  // -----------------------------
  const handleSaveRecipe = async () => {
    if (recipe.source !== "spoonacular" || !userEmail) return;

    setSavingRecipe(true);
    try {
      await addRecipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image: recipe.image,
        source: "spoonacular",
        author: userEmail,
      });
      setRecipeSaved(true);
      alert("Recipe saved!");
    } catch (err) {
      console.error("Failed to save recipe:", err);
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
      // Optional: redirect or close view
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      alert("Failed to delete recipe");
    }
  };

  return (
    <div className={styles.container}>
      {/* Action buttons: Save/Delete */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {isUserRecipe && <button onClick={handleDeleteRecipe}>Delete</button>}

        {recipe.source === "spoonacular" && !recipeSaved && (
          <button onClick={handleSaveRecipe} disabled={savingRecipe}>
            {savingRecipe ? "Saving..." : "Save to My Recipes"}
          </button>
        )}
      </div>

      {/* Recipe title */}
      <h2 className={styles.title}>{recipe.title}</h2>

      {/* Recipe image */}
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className={styles.image} />
      )}

      {/* Ingredients */}
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

      {/* Instructions */}
      <h3>Instructions</h3>
      <div className={styles.instructions}>
        {parseInstructions(recipe.instructions)}
      </div>
    </div>
  );
}
