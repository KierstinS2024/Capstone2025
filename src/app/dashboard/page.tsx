// path: src/app/dashboard/page.tsx
"use client";

/**
 * Recipes Dashboard Page
 * ----------------------
 * - Displays user-submitted and Spoonacular recipes
 * - Includes search functionality across both sources
 * - Allows navigation to recipe details or to create a new recipe
 * - Shows loading and error states
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

// Corrected import paths for CSS modules
import styles from "./recipes/RecipesPage.module.css"; // page-specific styles
import sharedStyles from "./recipes/RecipesShared.module.css"; // shared styles for form/buttons/errors

// Type definition for recipes (user-submitted and external)
type Recipe = {
  _id?: string; // user recipe ID (MongoDB)
  id?: number; // external API (Spoonacular) ID
  name?: string; // user-submitted name
  title?: string; // external recipe title
  description?: string;
  userSubmitted?: boolean;
  imageUrl?: string; // user-submitted image
  image?: string; // external recipe image
};

export default function RecipesDashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // --- Fetch user-submitted recipes from backend ---
  const fetchUserRecipes = async (query = "") => {
    if (!token) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/recipes?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch user recipes");
      setUserRecipes(data.recipes || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Error fetching user recipes");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Spoonacular recipes from external API ---
  const fetchExternalRecipes = async (query = "") => {
    if (!query) return; // skip empty search
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/external/recipes?search=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch external recipes");
      setExternalRecipes(data.results || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Error fetching external recipes");
    } finally {
      setLoading(false);
    }
  };

  // --- Initial fetch on page load ---
  useEffect(() => {
    fetchUserRecipes();
  }, []);

  // --- Handle search form submission ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserRecipes(searchTerm);
    fetchExternalRecipes(searchTerm);
  };

  return (
    <div>
      <NavBar />

      <div className={styles.container}>
        <h1 className={styles.title}>Recipes</h1>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className={sharedStyles.form}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            className={sharedStyles.input}
          />
          <button type="submit" className={sharedStyles.button}>
            Search
          </button>
        </form>

        {/* Add New Recipe button */}
        <button
          className={sharedStyles.button}
          style={{ marginTop: "1rem" }}
          onClick={() => router.push("/dashboard/recipes/new")}
        >
          + Add New Recipe
        </button>

        {/* Error & Loading messages */}
        {errorMessage && <p className={sharedStyles.error}>{errorMessage}</p>}
        {loading && <p className={sharedStyles.message}>Loading recipes...</p>}

        {/* User Recipes Section */}
        <section style={{ marginTop: "2rem" }}>
          <h2>User Recipes</h2>
          {userRecipes.length === 0 ? (
            <p className={sharedStyles.empty}>No user recipes found.</p>
          ) : (
            <div className={styles.grid}>
              {userRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className={styles.card}
                  onClick={() =>
                    router.push(`/dashboard/recipes/${recipe._id}`)
                  }
                >
                  {recipe.imageUrl && (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardTitle}>{recipe.name}</div>
                  <div className={styles.cardSubtitle}>User submitted</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* External Recipes Section */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Spoonacular Recipes</h2>
          {externalRecipes.length === 0 ? (
            <p className={sharedStyles.empty}>No external recipes found.</p>
          ) : (
            <div className={styles.grid}>
              {externalRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={styles.card}
                  onClick={() =>
                    router.push(`/dashboard/recipes/external/${recipe.id}`)
                  }
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardTitle}>{recipe.title}</div>
                  <div className={styles.cardSubtitle}>Spoonacular</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
