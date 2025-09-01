// src/pages/recipes.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Recipe {
  _id?: string;
  name: string;
  description?: string;
  instructions: string[];
  cuisine?: string;
  source?: string; // "Local" or external API
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeInstructions, setNewRecipeInstructions] = useState("");

  // Fetch recipes from the API
  const fetchRecipes = async (query?: string) => {
    try {
      const response = await axios.get("/api/recipes", {
        params: query ? { search: query } : {}
      });
      // Merge local and external recipes if present
      const combined = [
        ...(response.data.localRecipes || response.data.recipes || []),
        ...(response.data.externalRecipes || [])
      ];
      setRecipes(combined);
    } catch (err) {
      console.error("Error fetching recipes", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handler to submit a new recipe
  const handleAddRecipe = async () => {
    try {
      const token = localStorage.getItem("token"); // use auth context if available
      const response = await axios.post(
        "/api/recipes",
        {
          name: newRecipeName,
          instructions: newRecipeInstructions.split("\n"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipes(prev => [response.data.recipe, ...prev]);
      setNewRecipeName("");
      setNewRecipeInstructions("");
    } catch (err) {
      console.error("Error adding recipe", err);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={() => fetchRecipes(searchTerm)}>Search</button>

      {/* Add Recipe Form */}
      <div>
        <h2>Add New Recipe</h2>
        <input
          type="text"
          placeholder="Recipe name"
          value={newRecipeName}
          onChange={e => setNewRecipeName(e.target.value)}
        />
        <textarea
          placeholder="Instructions (one per line)"
          value={newRecipeInstructions}
          onChange={e => setNewRecipeInstructions(e.target.value)}
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
      </div>

      {/* Recipe List */}
      <ul>
        {recipes.map((r, i) => (
          <li key={i}>
            <strong>{r.name}</strong> {r.cuisine ? `(${r.cuisine})` : ""}{" "}
            {r.source ? `[${r.source}]` : "[Local]"}
            <ul>
              {r.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
