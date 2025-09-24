"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlans } from "@/context/MealPlanContext";
import AddToMealPlanModal from "./AddToMealPlanModal";
import { parseInstructions } from "@/utils/parseInstructions";
import styles from "@/styles/recipeDetail.module.css";

interface Props {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: Props) {
  const { add, addBulk } = useShoppingList();
  const { addRecipe } = useRecipes();
  const { activePlan } = useMealPlans();

  const [addingIngredient, setAddingIngredient] = useState<string | null>(null);
  const [addingAll, setAddingAll] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  // ⬅️ Replace this with however you get the current user's email
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const handleAddIngredient = async (ingredient: string) => {
    setAddingIngredient(ingredient);
    try {
      await add(ingredient);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    } finally {
      setAddingIngredient(null);
    }
  };

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
        author: userEmail, // ✅ attach user
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
      {/* ✅ Save button moved to top */}
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

      <h3>Instructions</h3>
      <div className={styles.instructions}>
        {parseInstructions(recipe.instructions)}
      </div>

      {activePlan && (
        <>
          <button
            className={styles.mealPlanBtn}
            onClick={() => setShowMealModal(true)}
          >
            Add to Meal Plan
          </button>

          {showMealModal && recipe.id && (
            <AddToMealPlanModal
              recipe={recipe}
              plan={activePlan}
              onClose={() => setShowMealModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
