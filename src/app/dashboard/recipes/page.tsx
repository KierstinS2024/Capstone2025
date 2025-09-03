// src/app/dashboard/recipes/page.tsx
"use client";

/**
 * RecipesListPage.tsx
 * -------------------
 * Lists user recipes with links to view/edit/create.
 * Uses API helpers and JWT token for secure access.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRequest } from "@/lib/api";
import styles from "./RecipesPage.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const token = localStorage.getItem("token") || undefined;
      const res = await getRequest<{ recipes: Recipe[] }>(
        "/api/recipes",
        token
      );
      if (res.error) setError(res.error);
      else if (res.data) setRecipes(res.data.recipes || []);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Recipes</h1>
          <Link href="/dashboard/recipes/new" className={styles.btnPrimary}>
            + New Recipe
          </Link>
        </header>

        {loading && <p>Loading recipes…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <ul className={styles.grid}>
            {recipes.map((r) => (
              <li key={r._id} className={styles.card}>
                <h3>{r.name}</h3>
                {r.cuisine && <p className={styles.muted}>{r.cuisine}</p>}
                {r.description && <p>{r.description}</p>}
                <div className={styles.actions}>
                  <Link
                    href={`/dashboard/recipes/${r._id}`}
                    className={styles.btn}
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/recipes/${r._id}/edit`}
                    className={styles.btn}
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
            {recipes.length === 0 && (
              <li className={styles.empty}>
                No recipes yet. Create your first one!
              </li>
            )}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
