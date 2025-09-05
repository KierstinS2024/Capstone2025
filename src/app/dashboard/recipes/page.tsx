"use client";

// ------------------- Imports -------------------
import { useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import RecipeForm from "@/components/RecipeForm";
import styles from "./RecipesPage.module.css";
import sharedStyles from "./RecipesShared.module.css";

// ------------------- Types -------------------
// Ingredient for internal recipes
interface Ingredient {
  name: string;
  quantity: string; // from API
  unit: string;
  ingredientId?: string; // optional for Spoonacular
}

// Recipe type for dashboard
interface Recipe {
  _id?: string;
  name: string;
  description: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: "user" | "spoonacular";
  externalId?: string; // Spoonacular ID
}

// ------------------- Component -------------------
export default function RecipesPage() {
  // --- State ---
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [spoonRecipes, setSpoonRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ------------------- Fetch recipes -------------------
  const fetchRecipes = async (query: string) => {
    if (!query.trim()) {
      setUserRecipes([]);
      setSpoonRecipes([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- Internal recipes ---
      const userRes = await fetch(
        `/api/recipes?search=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = await userRes.json();

      // Map ingredients safely to match RecipeForm (ingredientId required)
      const users: Recipe[] = (userData.recipes || []).map((r: any) => ({
        _id: r._id,
        name: r.name || "",
        description: r.description || "",
        cuisine: r.cuisine || "",
        ingredients: (r.ingredients || []).map((ing: any) => ({
          name: ing.name || "",
          quantity: String(ing.quantity || ""),
          unit: ing.unit || "",
          ingredientId: ing.ingredientId || "", // <-- guarantees string for RecipeForm
        })),
        instructions: r.instructions || [],
        source: "user",
      }));
      setUserRecipes(users);

      // --- Spoonacular recipes ---
      const spoonRes = await fetch(
        `/api/external/recipes?search=${encodeURIComponent(query)}`
      );
      const spoonData = await spoonRes.json();

      // Spoonacular ingredients don't have IDs, so we supply empty string
      const spoons: Recipe[] = (spoonData.results || []).map((r: any) => ({
        name: r.title || "",
        description: r.summary || "",
        cuisine: r.cuisine || "",
        ingredients: (r.extendedIngredients || []).map((ing: any) => ({
          name: ing.name || "",
          quantity: String(ing.amount || ""),
          unit: ing.unit || "",
          ingredientId: "", // required for RecipeForm
        })),
        instructions: (r.analyzedInstructions || [])
          .flatMap((instr: any) => instr.steps.map((s: any) => s.step))
          .filter(Boolean),
        source: "spoonacular",
        externalId: r.id.toString(),
      }));
      setSpoonRecipes(spoons);
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Handlers -------------------
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchRecipes(query);
  };

  const handleSave = () => {
    setEditingRecipe(null);
    fetchRecipes(searchQuery); // refresh list after save
  };

  const handleDelete = async (_id?: string) => {
    if (!_id) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Error deleting recipe: ${data.message || "Unknown error"}`);
      } else {
        fetchRecipes(searchQuery);
        alert("Recipe deleted successfully");
      }
    } catch (err) {
      alert(`Network error: ${err}`);
    }
  };

  // ------------------- Render -------------------
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipes Dashboard</h1>

      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* New Recipe Button */}
      {!editingRecipe && (
        <button
          className={sharedStyles.button}
          onClick={() =>
            setEditingRecipe({
              name: "",
              description: "",
              cuisine: "",
              ingredients: [
                { name: "", quantity: "1", unit: "", ingredientId: "" },
              ],
              instructions: [""],
              source: "user",
            })
          }
          style={{ marginBottom: "1rem" }}
        >
          Create New Recipe
        </button>
      )}

      {/* Recipe Form for edit/new */}
      {editingRecipe && (
        <RecipeForm
          initialData={{
            _id: editingRecipe._id,
            name: editingRecipe.name,
            description: editingRecipe.description,
            cuisine: editingRecipe.cuisine,
            instructions: editingRecipe.instructions,
            // Map ingredients safely
            ingredients: editingRecipe.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId || "",
              name: ing.name,
              quantity: Number(ing.quantity) || 1,
              unit: ing.unit,
            })),
          }}
          onSave={handleSave}
        />
      )}

      {/* Errors & Loading */}
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.message}>Loading recipes...</p>}
      {!loading &&
        !error &&
        userRecipes.length + spoonRecipes.length === 0 &&
        searchQuery.trim() && <p className={styles.empty}>No recipes found.</p>}

      {/* Recipe cards grid */}
      <div className={styles.grid}>
        {/* Internal recipes */}
        {userRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            showActions
            onEdit={() => setEditingRecipe(recipe)}
            onDelete={() => handleDelete(recipe._id)}
          />
        ))}

        {/* Spoonacular recipes */}
        {spoonRecipes.map((recipe) => (
          <Link
            key={recipe.externalId}
            href={`/dashboard/recipes/external/${recipe.externalId}`}
          >
            <RecipeCard recipe={recipe} showActions={false} />
          </Link>
        ))}
      </div>
    </div>
  );
}
