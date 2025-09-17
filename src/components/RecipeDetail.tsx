// PATH: src/components/RecipeDetail.tsx
"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes, Recipe } from "@/context/RecipeContext";
import AddToMealPlanModal from "./AddToMealPlanModal";
import styles from "../styles/recipeDetail.module.css";

interface Props {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: Props) {
  const { add, addBulk } = useShoppingList();
  const { addRecipe } = useRecipes();

  const [addingIngredient, setAddingIngredient] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  // Add single ingredient
  const handleAddIngredient = async (ingredient: string) => {
    setAddingIngredient(ingredient);
    try {
      await add(ingredient);
    } catch (err) {
      console.error("Failed to add ingredient:", ingredient, err);
    } finally {
      setAddingIngredient(null);
    }
  };

  // Add all ingredients
  const handleAddAll = async () => {
    if (!recipe.ingredients?.length) return;
    setAddingAll(true);
    try {
      await addBulk(recipe.ingredients);
    } catch (err) {
      console.error("Failed to add all ingredients:", err);
    } finally {
      setAddingAll(false);
    }
  };

  // Save Spoonacular recipe to user collection
  const handleSaveRecipe = async () => {
    if (recipe.source !== "spoonacular") return;

    setSavingRecipe(true);
    try {
      await addRecipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });
      setRecipeSaved(true);
    } catch (err) {
      console.error("Failed to save recipe:", err);
    } finally {
      setSavingRecipe(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{recipe.title}</h2>

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
            </button>{" "}
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
      <p className={styles.instructions}>
        {recipe.instructions || "No instructions provided."}
      </p>

      {/* Save Spoonacular Recipe */}
      {recipe.source === "spoonacular" && (
        <button
          className={styles.saveRecipeBtn}
          disabled={savingRecipe || recipeSaved}
          onClick={handleSaveRecipe}
        >
          {recipeSaved
            ? "Saved!"
            : savingRecipe
            ? "Saving..."
            : "Save to My Recipes"}
        </button>
      )}

      {/* Add to Meal Plan */}
      <button
        className={styles.mealPlanBtn}
        onClick={() => setShowMealModal(true)}
      >
        Add to Meal Plan
      </button>

      {showMealModal && (
        <AddToMealPlanModal
          recipe={recipe}
          onClose={() => setShowMealModal(false)}
        />
      )}
    </div>
  );
}
