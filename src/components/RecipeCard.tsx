// path: src/components/RecipeCard.tsx
"use client";
import React from "react";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="card">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
      <h4 style={{ marginTop: 10 }}>{recipe.title}</h4>
      <Link href={`/recipes/${recipe.id}`} className="link">
        View →
      </Link>
    </div>
  );
}
