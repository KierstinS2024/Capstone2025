// Path: src/app/recipes/page.tsx
"use client";

import React from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useRouter } from "next/navigation";

const RecipesPage: React.FC = () => {
  const { recipes } = useRecipes();
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        All Recipes
      </h1>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            onClick={() => router.push(`/recipes/${recipe._id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #d8cfc4",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
            )}
            <span style={{ fontWeight: 600, textAlign: "center" }}>
              {recipe.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
