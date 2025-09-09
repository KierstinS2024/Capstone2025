"use client";

import RecipeForm, { Recipe as RecipeFormType } from "@/components/RecipeForm";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  // Empty initialData for a new recipe
  const emptyRecipe: RecipeFormType = {
    name: "",
    description: "",
    cuisine: "",
    ingredients: [{ ingredientId: "", name: "", quantity: 1, unit: "" }],
    instructions: [""],
    source: "user",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Recipe</h1>
      <RecipeForm
        initialData={emptyRecipe}
        onSave={() => router.push("/recipes")}
      />
    </div>
  );
}
