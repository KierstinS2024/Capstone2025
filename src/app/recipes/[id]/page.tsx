// Path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useParams, useRouter } from "next/navigation";
import type { Recipe } from "@/types/recipe";

const RecipePage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const { recipes, toggleFavorite, deleteRecipe } = useRecipes();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const found = recipes.find((r) => r._id === id) || null;
    setRecipe(found);
  }, [id, recipes]);

  if (!recipe) {
    return <p style={{ padding: 24 }}>Recipe not found.</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
        {recipe.title}
      </h1>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      )}

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
        Ingredients
      </h2>
      <ul style={{ marginBottom: 16 }}>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.quantity} {ing.name}
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
        Instructions
      </h2>
      <p style={{ marginBottom: 16 }}>{recipe.instructions}</p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => toggleFavorite(recipe._id)}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: recipe.favorite ? "#facc15" : "#3b82f6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {recipe.favorite ? "Unfavorite" : "Favorite"}
        </button>

        <button
          onClick={() => {
            deleteRecipe(recipe._id);
            router.back();
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#ef4444",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecipePage;
