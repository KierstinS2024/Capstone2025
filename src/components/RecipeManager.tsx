// src/components/RecipeManager.tsx
// Full Recipe management UI with add, delete, favorite toggle, and selection for meal plans

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { Recipe } from "@/types/recipe";

interface SelectRecipeProps {
  onSelect: (recipe: Recipe) => void;
}

/** Component to select a recipe for meal plan */
const SelectRecipeForMealPlan: React.FC<SelectRecipeProps> = ({ onSelect }) => {
  const { recipes } = useRecipes();

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Select Recipe for Meal Plan</h3>
      <select
        onChange={(e) => {
          const selected = recipes.find((r) => r._id === e.target.value);
          if (selected) onSelect(selected);
        }}
        className="border p-1 w-full"
      >
        <option value="">-- Choose Recipe --</option>
        {recipes.map((r) => (
          <option key={r._id} value={r._id}>
            {r.title}
          </option>
        ))}
      </select>
    </div>
  );
};

/** Full Recipe Manager */
export const RecipeManager: React.FC = () => {
  const { recipes, loading, createRecipe, deleteRecipe } = useRecipes();
  const [newTitle, setNewTitle] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newInstructions, setNewInstructions] = useState("");

  if (loading) return <div>Loading recipes...</div>;

  const handleAddRecipe = async () => {
    if (!newTitle || !newIngredients || !newInstructions) {
      alert("Fill all fields");
      return;
    }

    const ingredientsArray = newIngredients.split(",").map((i) => ({
      name: i.trim(),
      quantity: "",
      unit: "",
    }));

    await createRecipe({
      title: newTitle,
      ingredients: ingredientsArray,
      instructions: newInstructions,
      source: "local",
    });

    setNewTitle("");
    setNewIngredients("");
    setNewInstructions("");
  };

  const handleFavoriteToggle = async (recipe: Recipe) => {
    recipe.favorite = !recipe.favorite;
    // Optional: call API to persist favorite status
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Recipe Manager</h2>

      {/* Add Recipe Form */}
      <div className="mb-6 p-2 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add New Recipe</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-1 mb-1 w-full"
        />
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={newIngredients}
          onChange={(e) => setNewIngredients(e.target.value)}
          className="border p-1 mb-1 w-full"
        />
        <textarea
          placeholder="Instructions"
          value={newInstructions}
          onChange={(e) => setNewInstructions(e.target.value)}
          className="border p-1 mb-1 w-full"
        />
        <button
          onClick={handleAddRecipe}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Recipe
        </button>
      </div>

      {/* Recipe List */}
      {recipes.length === 0 ? (
        <div>No recipes found.</div>
      ) : (
        <ul className="list-none p-0">
          {recipes.map((r) => (
            <li
              key={r._id}
              className="flex justify-between items-center border-t py-1"
            >
              <span>
                {r.title}{" "}
                {r.favorite && <span className="text-yellow-500">★</span>}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFavoriteToggle(r)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded"
                >
                  {r.favorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  onClick={() => deleteRecipe(r._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Example usage of SelectRecipeForMealPlan */}
      <SelectRecipeForMealPlan
        onSelect={(recipe) => {
          alert(`Selected recipe: ${recipe.title}`);
        }}
      />
    </div>
  );
};
