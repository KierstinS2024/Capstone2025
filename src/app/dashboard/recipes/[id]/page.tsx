// src/app/dashboard/recipes/[id]/page.tsx

import React from "react";

interface Recipe {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  cuisine?: string;
  userSubmitted?: boolean;
}

async function getRecipe(id: string): Promise<Recipe> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${id}`,
    {
      cache: "no-store",
    }
  );
  return res.json();
}

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipe(params.id);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

        {recipe.cuisine && (
          <p className="text-gray-500 mb-6 italic">{recipe.cuisine}</p>
        )}

        {recipe.description && (
          <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
        )}

        <div className="mt-6">
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              recipe.userSubmitted
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {recipe.userSubmitted ? "Your Recipe" : "External"}
          </span>
        </div>
      </div>
    </main>
  );
}
