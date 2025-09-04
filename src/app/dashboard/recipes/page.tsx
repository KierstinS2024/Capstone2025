// path: src/app/dashboard/recipes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import styles from "./RecipesPage.module.css"; // page-specific styles
import sharedStyles from "./RecipesShared.module.css"; // shared styles

type Recipe = {
  _id: string;
  name: string;
  description?: string;
  userSubmitted: boolean;
  imageUrl?: string; // optional thumbnail
};

export default function RecipesDashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [spoonacularRecipes, setSpoonacularRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch recipes
  const fetchRecipes = async (search = "") => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/recipes?search=${encodeURIComponent(search)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch recipes");

      // Separate user-submitted vs others (Spoonacular)
      const users: Recipe[] = data.recipes.filter(
        (r: Recipe) => r.userSubmitted
      );
      const spoonacular: Recipe[] = data.recipes.filter(
        (r: Recipe) => !r.userSubmitted
      );

      setUserRecipes(users);
      setSpoonacularRecipes(spoonacular);
    } catch (err: any) {
      setError(err.message || "Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(searchTerm);
  };

  const handleClickRecipe = (id: string) => {
    router.push(`/dashboard/recipes/${id}`);
  };

  return (
    <div>
      <NavBar />

      <div className={styles.container}>
        <h1 className={styles.title}>Recipes</h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className={sharedStyles.form}>
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

        {error && <p className={sharedStyles.error}>{error}</p>}
        {loading && <p className={sharedStyles.message}>Loading recipes...</p>}

        {/* User-submitted recipes */}
        <section style={{ marginTop: "2rem" }}>
          <h2>User Recipes</h2>
          {userRecipes.length === 0 ? (
            <p className={sharedStyles.empty}>No user recipes found.</p>
          ) : (
            <div className={styles.grid}>
              {userRecipes.map((r) => (
                <div
                  key={r._id}
                  className={styles.card}
                  onClick={() => handleClickRecipe(r._id)}
                  style={{ cursor: "pointer" }}
                >
                  {r.imageUrl && (
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardTitle}>{r.name}</div>
                  <div className={styles.cardSubtitle}>User submitted</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Spoonacular recipes */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Spoonacular Recipes</h2>
          {spoonacularRecipes.length === 0 ? (
            <p className={sharedStyles.empty}>No Spoonacular recipes found.</p>
          ) : (
            <div className={styles.grid}>
              {spoonacularRecipes.map((r) => (
                <div
                  key={r._id}
                  className={styles.card}
                  onClick={() => handleClickRecipe(r._id)}
                  style={{ cursor: "pointer" }}
                >
                  {r.imageUrl && (
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardTitle}>{r.name}</div>
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
