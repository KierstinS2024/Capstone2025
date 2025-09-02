// path: src/app/dashboard/recipes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import styles from "./RecipesListPage.module.css";

/**
 * RecipesListPage
 * Displays all recipes with search/filter functionality.
 */
export default function RecipesListPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");

  // Fetch recipes from API
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (cuisine) params.set("cuisine", cuisine);

        const res = await fetch(`/api/recipes?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch recipes");
        setRecipes(data.recipes || []);
      } catch (err: any) {
        setError(err.message || "Error loading recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [search, cuisine]);

  if (loading) return <p className={styles.message}>Loading recipes...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipes</h1>

      {/* Controls: Search + Filter + Create */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className={styles.selectInput}
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Indian">Indian</option>
          <option value="American">American</option>
          {/* Add more cuisines as needed */}
        </select>

        <button
          className={styles.createButton}
          onClick={() => router.push("/dashboard/recipes/create")}
        >
          + Create New Recipe
        </button>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <p className={styles.emptyMessage}>
          No recipes found. Try adjusting your search or filters.
        </p>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onClick={() => router.push(`/dashboard/recipes/${recipe._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
