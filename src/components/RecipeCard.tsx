"use client";

import React, { ReactNode, useState } from "react";
import { Recipe } from "@/types/recipe";
import { useAuth } from "@/context/AuthContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "./RecipeModal";
import styles from "@/styles/recipeCard.module.css";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: string) => Promise<void>; // Optional delete handler
  children?: ReactNode; // Optional extra buttons
}

export default function RecipeCard({ recipe, onDelete, children }: RecipeCardProps) {
  const { user } = useAuth();
  const { saveRecipeFromSearch } = useRecipes();

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const isUserOwned = user?.email && recipe.author === user.email;

  // -----------------------------
  // Delete handler
  // -----------------------------
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await onDelete(recipe.id);
    } catch (err) {
      console.error("Failed to delete recipe", err);
    }
  };

  // -----------------------------
  // Save search result to DB
  // -----------------------------
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    if (!user?.email) {
      alert("You must be logged in to save recipes.");
      return;
    }
    setSaving(true);
    try {
      await saveRecipeFromSearch(recipe);
      alert("Saved to your recipes!");
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      <div className={styles.recipeCard} onClick={() => setShowModal(true)}>
        {/* Recipe image */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.cardImage}
          />
        )}

        <div className={styles.cardContent}>
          {/* Recipe title */}
          <h3 className={styles.cardTitle}>{recipe.title}</h3>

          {/* Actions */}
          <div className={styles.actions}>
            {isUserOwned && (
              <button
                className={`${styles.button} ${styles.buttonDanger}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            )}

            {!isUserOwned && recipe.source === "spoonacular" && (
              <>
                <small className={styles.spoonacularLabel}>Spoonacular</small>
                {children || (
                  <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for full recipe details */}
      {showModal && (
        <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
