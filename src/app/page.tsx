"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import RecipeCard from "@/components/RecipeCard";
import { getApiClient } from "@/lib/api";
import { Recipe } from "@/types/recipe";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSampleRecipes = async () => {
      setLoading(true);
      try {
        const client = getApiClient();
        const res = await client.get<{ recipes: Recipe[] }>(
          "/external/recipes?limit=6"
        );
        setRecipes(res.data.recipes);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load sample recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetchSampleRecipes();
  }, []);

  return (
    <main className={styles.container}>
      <ThemeToggle />

      <section className={styles.hero}>
        <div className={styles.text}>
          <h1>Eat Better, Live Better</h1>
          <p>
            Plan meals, track nutrition, and build healthy habits with ease.
          </p>
          <div className={styles.actions}>
            <Link href="/auth/signup" className={styles.btnPrimary}>
              Get Started
            </Link>
            <Link href="/auth/login" className={styles.btnSecondary}>
              Log In
            </Link>
          </div>
        </div>
        <div className={styles.illustration} />
      </section>

      <section className={styles.features}>
        <div className={styles.card}>
          <h3>📅 Plan Meals</h3>
          <p>Create weekly meal plans effortlessly.</p>
        </div>
        <div className={styles.card}>
          <h3>🥗 Track Nutrition</h3>
          <p>See calories, macros, and balance at a glance.</p>
        </div>
        <div className={styles.card}>
          <h3>💾 Save Recipes</h3>
          <p>Keep your favorites in one place.</p>
        </div>
      </section>

      <section className={styles.samples}>
        <h2>Try These Recipes as a Guest</h2>
        {loading && <p>Loading recipes…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className={styles.sampleGrid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Start your journey today</h2>
        <Link href="/auth/signup" className={styles.btnPrimary}>
          Sign Up Free
        </Link>
      </section>
    </main>
  );
}
