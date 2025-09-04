// path: src/app/dashboard/recipes/page.tsx
/**
 * RecipesListPage.tsx
 * -------------------
 * Lists recipes with search capability.
 * Combines user-submitted recipes and Spoonacular results.
 * Supports viewing and editing user recipes; links to external Spoonacular recipes.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import { getApiClient } from "@/lib/api";
import axios from "axios";

// Recipe type, user or Spoonacular
interface RecipeItem {
  _id?: string; // Only user-submitted recipes
  name: string;
  description?: string;
  cuisine?: string;
  source: "user" | "spoonacular";
  externalId?: string; // Only Spoonacular recipes
}

export default function RecipesListPage() {
  const [recipeList, setRecipeList] = useState<RecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Fetch recipes based on search term.
   * Pulls from both user-submitted recipes and Spoonacular.
   */
  const fetchRecipes = async (searchTerm: string) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const userToken = localStorage.getItem("token") || undefined;
      const apiClient = getApiClient(userToken);

      // Fetch user-submitted recipes
      const userResponse = await apiClient.get(
        `/recipes?search=${encodeURIComponent(searchTerm)}`
      );
      const userRecipes: RecipeItem[] = (userResponse.data.recipes || []).map(
        (userRecipe: any) => ({
          _id: userRecipe._id,
          name: userRecipe.name,
          description: userRecipe.description,
          cuisine: userRecipe.cuisine,
          source: "user",
        })
      );

      // Fetch Spoonacular recipes
      const spoonacularResponse = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
          searchTerm
        )}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_KEY}`
      );
      const spoonacularRecipes: RecipeItem[] = (
        spoonacularResponse.data.results || []
      ).map((spoonRecipe: any) => ({
        name: spoonRecipe.title,
        source: "spoonacular",
        externalId: spoonRecipe.id.toString(),
      }));

      setRecipeList([...userRecipes, ...spoonacularRecipes]);
    } catch (error: any) {
      console.error("Error fetching recipes:", error);
      setLoadError(error.message || "Error fetching recipes");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: all user recipes
  useEffect(() => {
    fetchRecipes("");
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <header>
          <h1>Recipes</h1>
          <Link href="/dashboard/recipes/new">
            <button>+ New Recipe</button>
          </Link>
        </header>

        <SearchBar onSearch={fetchRecipes} />

        {isLoading && <p>Loading recipes...</p>}
        {loadError && <p>{loadError}</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {recipeList.map((recipe, index) => {
            // Build user-friendly Spoonacular URL
            const spoonacularUrl =
              recipe.source === "spoonacular" && recipe.externalId
                ? `https://spoonacular.com/recipes/${recipe.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${recipe.externalId}`
                : undefined;

            return (
              <li
                key={recipe._id || recipe.externalId || index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>{recipe.name}</h3>
                {recipe.cuisine && <p>Cuisine: {recipe.cuisine}</p>}
                {recipe.description && <p>{recipe.description}</p>}
                <div>
                  {recipe.source === "user" ? (
                    <>
                      <Link href={`/dashboard/recipes/${recipe._id}`}>
                        View
                      </Link>
                      {" | "}
                      <Link href={`/dashboard/recipes/${recipe._id}/edit`}>
                        Edit
                      </Link>
                    </>
                  ) : (
                    <a
                      href={spoonacularUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Spoonacular
                    </a>
                  )}
                </div>
              </li>
            );
          })}
          {recipeList.length === 0 && !isLoading && <li>No recipes found.</li>}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
