// path: src/app/dashboard/recipes/new/page.tsx
"use client";

import RecipeForm from "@/components/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Recipe</h1>
      <RecipeForm mode="create" />
    </div>
  );
}
