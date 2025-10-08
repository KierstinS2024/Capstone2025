"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import styles from "@/styles/recipeDetail.module.css";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { recipes } = useRecipes();
  const router = useRouter();

  // Find recipe
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className={styles.emptyState}>
        <h1>Recipe Not Found</h1>
        <p>
          This recipe isn’t saved yet. Please search for it on the{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 600,
            }}
            onClick={() => router.push("/recipes")}
          >
            Recipes page
          </button>{" "}
          and save it to view details here.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.recipeDetail}>
      {/* Title */}
      <h1 className={styles.recipeTitle}>{recipe.title}</h1>

      {/* Image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.recipeImage}
        />
      )}

      {/* Ingredients */}
      {recipe.ingredients?.length > 0 && (
        <div className={styles.ingredients}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <div className={styles.instructions}>
          <h2 className={styles.sectionTitle}>Instructions</h2>
          <p>{recipe.instructions}</p>
        </div>
      )}
    </div>
  );
}
